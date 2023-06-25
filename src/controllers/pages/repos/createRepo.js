const PageTemplate = require('@src/www/pages/standardPage');
const CreateRepo = require('@src/www/content/repos/createRepo');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const projectsQuery = await CRUD.query({collectionName: 'projects'}).defaultPopulate();
    if (projectsQuery instanceof Error.Log || !projectsQuery) {
        return res.status(500).send(projectsQuery.toJSON());
    }

    const projects = projectsQuery.map(item => item.initialize());
    const content = new PageTemplate({
        pageID: 'repos/createRepo',
        pageTitle: 'Add Repository',
        body: new CreateRepo({
            fieldName: 'repos',
            projects
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
