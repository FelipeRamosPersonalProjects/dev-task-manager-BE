const PageTemplate = require('@src/www/pages/standardPage');
const CreateRepo = require('@src/www/content/repos/createRepo');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const projectsQuery = await CRUD.query({collectionName: 'projects'}).defaultPopulate();
    if (projectsQuery instanceof Error.Log || !projectsQuery) {
        return res.status(500).send(projectsQuery.toJSON());
    }

    const templatesQuery = await CRUD.query({collectionName: 'templates'}).defaultPopulate();
    if (templatesQuery instanceof Error.Log || !templatesQuery) {
        return res.status(500).send(templatesQuery.toJSON());
    }

    const projects = projectsQuery.map(item => item.initialize());
    const templates = templatesQuery.map(item => item.initialize());
    const content = new PageTemplate({
        pageID: 'repos/createRepo',
        pageTitle: 'Add Repository',
        body: new CreateRepo({
            fieldName: 'repos',
            projects,
            templates
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
