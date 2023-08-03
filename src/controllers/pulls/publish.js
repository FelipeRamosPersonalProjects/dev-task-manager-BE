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
        const { publish, leave } = request.getBody();

        const socketConnection = global.socketServer.getConnection(req.session.progressPR.socketConnectionID);
        const subscription = socketConnection.getSubscription(req.session.progressPR.subscriptionUID);
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        const repoManager = prDoc && prDoc.repoManager;

        return res.status(200).send(Object().toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
