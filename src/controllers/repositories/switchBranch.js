const Request = require('@models/RequestAPI');
const CRUD = require('@CRUD');

const bodySchema = {
    repoUID: { type: String, required: true }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { repoUID, switchTo, bringChanges, socketConnectionID, subscriptionUID } = request.getBody();

        const socketConnection = global.socketServer.getConnection(socketConnectionID);
        const subscription = socketConnection && socketConnection.getSubscription(subscriptionUID);
        const repoDoc = await CRUD.getDoc({collectionName: 'repos', filter: { _id: repoUID }}).defaultPopulate();
        const notFoundError = new Error.Log({
            name: 'REPO_NOT_FOUND',
            message: `The repository "${repoUID}" wasn't found!`
        });

        if (!repoDoc) {
            return res.status(404).send(notFoundError.response());
        }

        if (repoDoc instanceof Error.Log) {
            return res.status(500).send(repoDoc.response());
        }

        const repo = repoDoc.initialize();
        const { repoManager } = Object(repo);

        if (repoManager) {
            repoManager.connectAPI(req.session.currentUser);
            repoManager.checkout(switchTo, { bringChanges }).then(({success}) => {
                if (success) {
                    const layoutComponent = subscription && subscription.component;
                    const branchSwitcher = Object(layoutComponent).getSafe('sidebar.repo.branchSwitcher');

                    if (branchSwitcher) {
                        layoutComponent.sidebar.repo.branchSwitcher.refresh();
                    }

                    subscription.toClient();
                } else {
                    subscription.toClientError();
                }
            });

            return res.status(200).send(Object().toSuccess());
        } else {
            return res.status(500).send(notFoundError.response());
        }
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}

