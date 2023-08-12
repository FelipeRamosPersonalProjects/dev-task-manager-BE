const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditRepo = require('@src/www/content/repos/readEditRepo');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const projectsQuery = await CRUD.query({collectionName: 'projects'}).defaultPopulate();
        const templatesQuery = await CRUD.query({collectionName: 'templates'}).defaultPopulate();
        const repoDoc = await CRUD.getDoc({collectionName: 'repos', filter: { index: req.params.index }}).defaultPopulate();

        if (!repoDoc || !projectsQuery || !templatesQuery) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The repo "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (repoDoc instanceof Error.Log || projectsQuery instanceof Error.Log || templatesQuery instanceof Error.Log) {
            throw repoDoc;
        }

        const projects = projectsQuery.map(item => item.initialize());
        const templates = templatesQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageID: 'repos/readEditRepo',
            pageTitle: 'Edit Repository',
            body: new ReadEditRepo({
                projects,
                templates,
                repoDoc: repoDoc.initialize()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
