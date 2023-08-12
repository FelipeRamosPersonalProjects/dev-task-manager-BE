const PageTemplate = require('@src/www/pages/standardPage');
const CreateTemplate = require('@src/www/content/templates/createTemplate');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const organizationsQuery = await CRUD.query({collectionName: 'organizations', filter: {}}).defaultPopulate();
        const projectsQuery = await CRUD.query({collectionName: 'projects', filter: {}}).defaultPopulate();
        const spacesQuery = await CRUD.query({collectionName: 'space_desks', filter: {}}).defaultPopulate();
    
        const organizations = organizationsQuery.map(item => item.initialize());
        const projects = projectsQuery.map(item => item.initialize());
        const spaces = spacesQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageID: 'templates/createTemplate',
            pageTitle: 'Create Template',
            body: new CreateTemplate({
                organizations,
                projects,
                spaces
            })
        });
    
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.status(500).send(new Error.Log(err).response());
    }
}
