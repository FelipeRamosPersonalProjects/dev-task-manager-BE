module.exports = async function (req, res) {
    try {
        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection && socketConnection.getSubscription(req.session.progressPR.subscriptionUID);
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;
        const stepCreatePR = progressModal && progressModal.stepCreatePR;
        const feedback = stepCreatePR && stepCreatePR.feedback;

        if (!repoManager) {
            return subscription.toClientError();
        }

        try {
            feedback.checkingRemoteConnection(subscription).setLoading(true);

            repoManager.connectAPI(req.session.currentUser);
            feedback.checkingRemoteConnection(subscription).setSuccess(true);
        } catch (err) {
            feedback.checkingRemoteConnection(subscription).setError(true, err)
        }

        feedback.creatingPR(subscription).setLoading(true);
        prDoc.publishPR({
            logsCB: (message) => {
                progressModal.addLog(message);
            }
        }).then(created => {
            if (created.error) {
                return feedback.creatingPR(subscription).setError(true, created);
            }

            progressModal.prDoc = created;
            progressModal.nextStep.completed();
            feedback.creatingPR(subscription).setSuccess(true);

            delete req.session.progressPR;
        }).catch(err => feedback.creatingPR(subscription).setError(true, err));

        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
