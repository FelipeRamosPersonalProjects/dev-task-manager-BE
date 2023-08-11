const Request = require('@models/RequestAPI');

const bodySchema = {
    commitData: {
        type: {
            title: { type: String },
            description: { type: String }
        }
    },
    loadChanges: { type: Boolean },
    skip: { type: Boolean }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { commitData, loadChanges, skip } = request.getBody();

        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection.getSubscription(req.session.progressPR.subscriptionUID);
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;
        const stepCommit = progressModal && progressModal.stepCommit;
        const feedback = stepCommit && stepCommit.feedback;

        if (skip) {
            feedback.skipping(subscription).setLoading(true);
            progressModal.nextStep.publish(req.session.currentUser).then(done => {
                feedback.skipping(subscription).setSuccess(true);
            }).catch(err => {
                feedback.skipping(subscription).setError(true, err);
            });

            return res.status(200).send(Object().toSuccess());
        }

        if (repoManager) {
            if (loadChanges) {
                feedback.gettingCurrentChanges(subscription).setLoading(true);
                repoManager.currentChanges().then(files => {
                    progressModal.stepCommit.fileChanges = files.changes;
                    progressModal.stepCommit.setButton.loadChanges(false);
                    progressModal.stepCommit.setButton.createCommit(true);

                    feedback.gettingCurrentChanges(subscription).setSuccess(true);
                }).catch(err => {
                    feedback.gettingCurrentChanges(subscription).setError(true, err);
                });
            }

            if (commitData) {
                const { title, description, fileChanges } = Object(commitData);

                feedback.commiting(subscription).setLoading(true);
                repoManager.commit(title, description, { fileChanges }).then((commited) => {
                    if (commited.error) {
                        return subscription.toClientError(commited);
                    }

                    return progressModal.nextStep.publish(req.session.currentUser);
                }).then(() => {
                    feedback.commiting(subscription).setSuccess(true);
                }).catch(err => {
                    feedback.commiting(subscription).setError(true, err);
                });
            }
        }

        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
