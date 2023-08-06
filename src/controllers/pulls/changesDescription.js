const Request = require('@models/RequestAPI');

const bodySchema = {
    fileChanges: { type: [ Object ] }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { fileChanges } = request.getBody();

        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection && socketConnection.getSubscription(req.session.progressPR.subscriptionUID);
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;

        if (!repoManager) {
            res.status(500).send(new Error.Log({
                name: 'REPO_MANARGER_NOT_FOUND',
                message: `The RepoManager instance prop was not found!`
            }));
        }

        if (Array.isArray(fileChanges)) {
            prDoc.fileChanges.map(item => {
                const change = fileChanges.find(file => file.filename === item.filename);

                item.description = change.description;
            });

            prDoc.updateDB({ filter: { index: prDoc.index }, data: { fileChanges: prDoc.fileChanges }}).then(async (updated) => {
                if (updated instanceof Error.Log) {
                    return subscription.toClientError(updated);
                }

                await progressModal.nextStep.createPR();
                subscription.toClient();
            }).catch(err => subscription.toClientError(err));
        }

        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
