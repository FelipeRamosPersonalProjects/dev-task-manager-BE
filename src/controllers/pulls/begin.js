const CRUD = require('@CRUD');
const Request = require('@models/RequestAPI');
const SessionProgressPR = require('@src/models/SessionProgressPR');
const Configs = require('@config');

const cookiesConfig = {
    maxAge: Configs.sessionMaxAge,
    httpOnly: true,
    secure: Configs.secureCookies
};
const bodySchema = {
    prIndex: {
        type: Number,
        required: true
    },
    subscriptionUID: {
        type: String,
        required: true
    },
    socketConnectionID: {
        type: String,
        required: true
    }
};

function isInvalid(params) {
    const { res, socketConnection, socketConnectionID, subscriptionUID } = Object(params);

    if (!socketConnection) {
        return res.status(400).send(new Error.Log({
            name: 'SOCKET_CONNECTION_NOT_FOUND',
            message: `The socket connection "${socketConnectionID}" wasn't found!`
        }).response());
    }

    const subscription = socketConnection.getSubscription(subscriptionUID);
    if (!subscription) {
        return res.status(400).send(new Error.Log({
            name: 'SUBSCRIPTION_NOT_FOUND',
            message: `The socket subscription for "${subscriptionUID}" wasn't found!`
        }).response());
    }

    const stepComponent = subscription && subscription.component;
    if (!stepComponent) {
        return res.status(400).send(new Error.Log({
            name: 'COMPONENT_NOT_FOUND',
            message: `The component for subscription "${subscriptionUID}" wasn't found!`
        }).response());
    }

    return false;
}

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { prIndex, subscriptionUID, socketConnectionID, ignoreBranchName, switchToBase } = request.getBody();

        // Getting PR document from database
        const docQuery = await CRUD.getDoc({ collectionName: 'pull_requests', filter: { index: prIndex }}).defaultPopulate();
        const doc = docQuery.initialize();

        // Validating
        const socketConnection = global.socketServer.getConnection(socketConnectionID);
        if (isInvalid({res, socketConnection, subscriptionUID, socketConnectionID})) {
            return;
        }

        // Storing session
        if (!req.session.progressPR) {
            const progress = new SessionProgressPR({
                docQuery,
                socketConnectionID,
                subscriptionUID
            });

            req.session.progressPR = progress;
            res.cookie('progressPR', progress, cookiesConfig);
        }

        const subscription = socketConnection.getSubscription(subscriptionUID);
        const stepsComponent = subscription && subscription.component;
        const repoManager = doc && doc.repoManager;
        const stepBegin = stepsComponent && stepsComponent.stepBegin;
        const feedback = stepBegin && stepBegin.feedback;

        try {
            feedback.repoConnect(subscription).setLoading(true);

            repoManager.connectAPI(req.session.currentUser);
            feedback.repoConnect(subscription).setSuccess(true);
        } catch (err) {
            feedback.repoConnect(subscription).setError(true, err);
        }

        if (switchToBase) {
            feedback.switchToBase(subscription).setLoading(true);

            repoManager.checkout(doc.base, {
                bringChanges: true,
                logsCB: (message) => {
                    stepsComponent.addLog(message);
                }
            }).then(async () => {
                feedback.switchToBase(subscription).setSuccess(true);
            }).catch(err => {
                feedback.switchToBase(subscription).setError(true, err);
            });
        }

        // Getting current branch on local GIT
        feedback.gettingBranch(subscription).setLoading(true);

        stepsComponent.addLog('Getting current branch...');
        const currentBranch = await doc.repoManager.getCurrentBranch();

        if (currentBranch) {
            stepsComponent.addLog('Current branch is ' + currentBranch);

            stepsComponent.setProps.branchSwitcherGroup({currentBranch});
            feedback.gettingBranch(subscription).setSuccess(true, currentBranch);
        } else {
            feedback.gettingBranch(subscription).setError(true);
        }

        if (ignoreBranchName || doc.head === currentBranch || doc.base === currentBranch) {
            stepsComponent.nextStep.prepare();
        } else {
            stepsComponent.setError.BAD_BRANCH_NAME();
        }

        subscription.toClient();
        return res.status(200).send(doc.toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
