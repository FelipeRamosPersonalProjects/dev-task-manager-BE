const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditEstimation = require('@src/www/content/estimations/readEditEstimation');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const estimationDoc = await CRUD.getDoc({collectionName: 'estimations', filter: { index: req.params.index }}).defaultPopulate();
        if (!estimationDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The estimation "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (estimationDoc instanceof Error.Log) {
            throw estimationDoc;
        }

        const content = new PageTemplate({
            pageTitle: 'Edit Estimation',
            body: new ReadEditEstimation({
                projects,
                spaces,
                formState: 'read',
                estimationDoc: estimationDoc.initialize()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
