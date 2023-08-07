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

        if (skip || stayCurrent) {
            progressModal.nextStep.commit();
            subscription.toClient();
            return res.status(200).send(Object().toSuccess());
        }

        if (switchBranch) {
            repoManager.checkout(prDoc.head, { bringChanges: true }).then(switched => {
                progressModal.nextStep.commit();
                subscription.toClient();
            }).catch(err => subscription.toClientError(err));

            return res.status(200).send(Object().toSuccess());
        }

        const isBranchExist = repoManager && await repoManager.isBranchExist(customBranchName || prDoc.head);
        let head = prDoc.head;

        if (!isBranchExist) {
            throw 'isBranch returned "undefined"!'
        }

        if (isBranchExist.isExist) {
            const availableBranch = await repoManager.findAvailableBranch(head, subscription);

            progressModal.setError.DUPLICATED_BRANCH(customBranchName, availableBranch);
        } else if (customBranchName) {
            head = customBranchName;
        }
        
        if (head && !isBranchExist.isExist) {
            repoManager.createBranch(head, prDoc.base, { bringChanges: true, subscription }).then(created => {
                progressModal.nextStep.commit();
                subscription.toClient();
            }).catch(err => {
                subscription.toClientError(err);
            });
        }

        subscription.toClient();
        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
