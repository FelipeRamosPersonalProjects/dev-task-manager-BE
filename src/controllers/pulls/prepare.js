const Request = require('@models/RequestAPI');

const bodySchema = {
    customBranchName: { type: String },
    skip: { type: Boolean },
    stayCurrent: { type: Boolean },
    switchBranch: { type: Boolean },
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { customBranchName, skip, stayCurrent, switchBranch } = request.getBody();

        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection.getSubscription(req.session.progressPR.subscriptionUID);

        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;
        const stepPrepare = progressModal && progressModal.stepPrepare;
        const feedback = stepPrepare && stepPrepare.feedback;
        let currentChanges;

        try {
            feedback.gettingCurrentChanges(subscription).setLoading(true);
            currentChanges = await repoManager.currentChanges();

            if (!currentChanges || currentChanges instanceof Error.Log) {
                const error = new Error.Log({
                    name: 'CAN_NOT_GET_BRANCH',
                    message: `Error caught getting the current local branch!`
                });
                
                if (currentChanges) {
                    error.append(error);
                }

                throw error;
            }

            feedback.gettingCurrentChanges(subscription).setSuccess(true);
        } catch (err) {
            return feedback.gettingCurrentChanges(subscription).setError(true, err);
        }

        try {
            feedback.connectingRemote(subscription).setLoading(true);
            repoManager.connectAPI(req.session.currentUser);
            feedback.connectingRemote(subscription).setSuccess(true);
        } catch (err) {
            return feedback.connectingRemote(subscription).setError(true, err);
        }

        if (skip || stayCurrent) {
            progressModal.setFeedback('stepPrepare', 'readyFeedback', 'success', 'Ready!');
            progressModal.nextStep.commit(currentChanges);
            subscription.toClient();
            return res.status(200).send(Object().toSuccess());
        }

        if (switchBranch) {
            feedback.switchingBranch(subscription).setLoading(true, prDoc.head);
            repoManager.checkout(prDoc.head, { bringChanges: true, subscription }).then(switched => {
                progressModal.nextStep.commit(currentChanges);
                feedback.switchingBranch(subscription).setSuccess(true, prDoc.head);
            }).catch(err => feedback.switchingBranch(subscription).setError(true, err));

            return res.status(200).send(Object().toSuccess());
        }

        let head = prDoc.head;
        const branchName  = customBranchName || head;
        let isBranchExist;

        try {
            feedback.checkingBranchExistence(subscription).setLoading(true, branchName);
            isBranchExist = repoManager && await repoManager.isBranchExist(branchName);
        } catch (err) {
            feedback.checkingBranchExistence(subscription).setError(true, err)
        }

        if (!isBranchExist) {
            throw 'isBranch returned "undefined"!'
        }

        if (isBranchExist.isExist) {
            const availableBranch = await repoManager.findAvailableBranch(head, subscription);

            progressModal.setError.DUPLICATED_BRANCH(customBranchName, availableBranch);
            feedback.checkingBranchExistence(subscription).setErrorAlreadyExist(true, availableBranch)
        } else if (customBranchName) {
            head = customBranchName;
            feedback.checkingBranchExistence(subscription).setSuccess(true, head);
        }
        
        feedback.checkingBranchExistence(subscription).setSuccess(true, head);
        if (head && !isBranchExist.isExist) {
            feedback.creatingBranch(subscription).setLoading(true, head);

            repoManager.createBranch(head, prDoc.base, { bringChanges: true, subscription }).then(async () => {
                progressModal.nextStep.commit(currentChanges);
                feedback.creatingBranch(subscription).setSuccess(true, head);
            }).catch(err => feedback.creatingBranch(subscription).setError(true, err));
        }

        subscription.toClient();
        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
