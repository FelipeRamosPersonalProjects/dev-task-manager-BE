const Request = require('@models/RequestAPI');

const bodySchema = {
    publish: {
        type: Boolean
    },
    leave: {
        type: Boolean
    }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { push, skip } = request.getBody();

        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection.getSubscription(req.session.progressPR.subscriptionUID);
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;
        const stepPublish = progressModal && progressModal.stepPublish;
        const feedback = stepPublish && stepPublish.feedback;

        if (skip) {
            feedback.skipping(subscription).setLoading(true);
            progressModal.nextStep.changesDescription().then(() => {
                feedback.skipping(subscription).setSuccess(true);
            }).catch(err => feedback.skipping(subscription).setError(true, err))
        }

        if (push) {
            feedback.publishing(subscription).setLoading(true, prDoc.head);
            repoManager.push().then(async (pushed) => {
                if (pushed.error) {
                    return feedback.publishing(subscription).setError(true, pushed);
                }

                feedback.publishing(subscription).setSuccess(true, prDoc.head);
                feedback.loadingNext(subscription).setLoading(true);
                const changed = await progressModal.nextStep.changesDescription();
                if (changed instanceof Error.Log) {
                    return feedback.loadingNext(subscription).setError(true, changed);
                }

                feedback.loadingNext(subscription).setSuccess(true);
            }).catch(err => feedback.publishing(subscription).setError(true, err))
        }

        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
