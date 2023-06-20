const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditPullRequest = require('@src/www/content/pullrequests/readEditPullRequest');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const pullrequestDoc = await CRUD.getDoc({collectionName: 'pullrequests', filter: { index: req.params.index }}).defaultPopulate();
        if (!pullrequestDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The pullrequest "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (pullrequestDoc instanceof Error.Log) {
            throw pullrequestDoc;
        }

        const content = new PageTemplate({
            pageTitle: 'Edit PullRequest',
            body: new ReadEditPullRequest({
                fieldName: 'project',
                projects,
                spaces,
                formState: 'read',
                pullrequestDoc: pullrequestDoc.initialize()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
