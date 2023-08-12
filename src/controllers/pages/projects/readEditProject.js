const PageTemplate = require('@www/pages/standardPage');
const ErrorPage = require('@www/error');
const ReadEditProject = require('@www/content/projects/readEditProject');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const projectDoc = await CRUD.getDoc({collectionName: 'projects', filter: { index: req.params.index }}).defaultPopulate();
        if (!projectDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The project "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (projectDoc instanceof Error.Log) {
            throw projectDoc;
        }

        const spacesQuery = await CRUD.query({collectionName: 'space_desks'}).defaultPopulate();
        const templatesQuery = await CRUD.query({collectionName: 'templates'}).defaultPopulate();
        const reposQuery = await CRUD.query({collectionName: 'repos' }).defaultPopulate();
        const spaces = spacesQuery.map(item => item.initialize());
        const templates = templatesQuery.map(item => item.initialize());
        const repos = reposQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageID: 'projects/readEditProject',
            pageTitle: 'Edit Project',
            body: new ReadEditProject({
                spaces,
                repos,
                templates,
                projectDoc: projectDoc.initialize()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
