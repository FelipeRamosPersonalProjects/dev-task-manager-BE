const CRUD = require('@CRUD');
const Request = require('@models/RequestAPI');

const bodySchema = {
    prIndex: {
        type: Number,
        required: true
    },
    subscriptionUID: {
        type: String,
        required: true
    },
    socketConnectionID: {
        type: String,
        required: true
    }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { prIndex, subscriptionUID, socketConnectionID } = request.getBody();
        const docQuery = await CRUD.getDoc({collectionName: 'pull_requests', filter: { index: prIndex }}).defaultPopulate();
        const doc = docQuery.initialize();
        const currentBranch = await doc.repoManager.getCurrentBranch();
        const socketConnection = socketServer.getConnection(socketConnectionID);
        const branchSwitcher = { currentBranch };

        if (!socketConnection) {
            return res.status(400).send(new Error.Log({
                name: 'SOCKET_CONNECTION_NOT_FOUND',
                message: `The socket connection "${socketConnectionID}" wasn't found!`
            }).response());
        }

        if (!req.session.prInProgress) {
            req.session.prInProgress = doc;
        }

        socketConnection.updateComponent(subscriptionUID, { branchSwitcher });
        return res.status(200).send(doc.toSuccess());
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}

