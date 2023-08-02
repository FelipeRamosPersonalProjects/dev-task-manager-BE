const Request = require('@models/RequestAPI');

const bodySchema = {
    customBranchName: {
        type: String
    }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { customBranchName } = request.getBody();

        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection.getSubscription(req.session.progressPR.subscriptionUID);

        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;
        const isBranchExist = repoManager && await repoManager.isBranchExist(customBranchName || prDoc.head);
        let head;

        if (isBranchExist.isExist) {
            progressModal.setError.DUPLICATED_BRANCH(customBranchName);
        } else if (customBranchName) {
            head = customBranchName;
        }
        
        if (head) {
            repoManager.createBranch(head, prDoc.base, { bringChanges: true }).then(created => {
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
