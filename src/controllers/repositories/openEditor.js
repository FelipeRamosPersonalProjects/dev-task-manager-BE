const Request = require('@models/RequestAPI');
const CRUD = require('@CRUD');

const bodySchema = {
    editorID: { type: String, enum: ['vscode'], default: 'vscode' },
    repoUID: { type: String, required: true }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const { editorID, repoUID } = request.getBody();

        const repoDoc = await CRUD.getDoc({collectionName: 'repos', filter: { _id: repoUID }}).defaultPopulate();
        const notFoundError = new Error.Log({
            name: 'REPO_NOT_FOUND',
            message: `The repository "${repoUID}" wasn't found!`
        });

        if (!repoDoc) {
            return res.status(404).send(notFoundError.response());
        }

        if (repoDoc instanceof Error.Log) {
            return res.status(500).send(repoDoc.reponse());
        }

        const repo = repoDoc.initialize();
        if (repo) {
            const opened = await repo.openEditor();
            return res.status(200).send(opened.toSuccess());
        } else {
            return res.status(500).send(notFoundError.response());
        }
    } catch(err) {
        const error = new Error.Log(err);
        return res.status(500).json(error.response());
    }
}
