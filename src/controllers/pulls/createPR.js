module.exports = async function (req, res) {
    try {
        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection && socketConnection.getSubscription(req.session.progressPR.subscriptionUID);
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;

        if (!repoManager) {
            return subscription.toClientError();
        }

        repoManager.connectAPI(req.session.currentUser);
        prDoc.publishPR().then(created => {
            if (created.error) {
                return subscription.toClientError(created);
            }

            progressModal.prDoc = created;
            progressModal.nextStep.completed();
            subscription.toClient();

            delete req.session.progressPR;
        }).catch(err => subscription.toClientError(err));

        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
