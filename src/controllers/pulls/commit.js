const Request = require('@models/RequestAPI');

const bodySchema = {
    commitData: {
        type: {
            title: { type: String },
            description: { type: String }
        }
    },
    loadChanges: {
        type: Boolean
    },
    skip: {
        type: Boolean
    }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { commitData, loadChanges, skip } = request.getBody();

        if (skip) {
            return res.status(200).send(Object().toSuccess());
        }

        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection.getSubscription(req.session.progressPR.subscriptionUID);
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;

        if (repoManager) {
            if (loadChanges) {
                repoManager.currentChanges().then(files => {
                    progressModal.stepCommit.fileChanges = files.changes;
                    progressModal.stepCommit.setButton.loadChanges(false);
                    progressModal.stepCommit.setButton.createCommit(true);

                    subscription.toClient();
                }).catch(err => {
                    subscription.toClientError(err);
                });
            }

            if (commitData) {
                const { title, description, fileChanges } = Object(commitData);

                repoManager.commit(title, description, { fileChanges }).then(commited => {
                    progressModal.stepCommit.resolve();
                    subscription.toClient();
                }).catch(err => {
                    subscription.toClientError(err);
                });
            }
        }

        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
