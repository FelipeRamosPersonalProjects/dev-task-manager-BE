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

        if (switchToBase) {
            const switched = await doc.repoManager.checkout(doc.base, { bringChanges: true });

            await CRUD.update({
                collectionName: 'pull_requests',
                filter: { index: prIndex },
                data: { $addToSet: { logsHistory: switched.out } }
            });
        }

        // Getting current branch on local GIT
        const currentBranch = await doc.repoManager.getCurrentBranch();

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

        stepsComponent.prDoc.task.repo.repoManager.connectAPI(req.session.currentUser);

        if (currentBranch) {
            stepsComponent.setProps.branchSwitcherGroup({currentBranch});
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
