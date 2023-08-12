const PageTemplate = require('@src/www/pages/standardPage');
const CreateTemplate = require('@src/www/content/templates/createTemplate');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const organizationsQuery = await CRUD.query({ collectionName: 'organizations' }).defaultPopulate();
        const templatesQuery = await CRUD.query({ collectionName: 'templates' }).defaultPopulate();
    
        const organizations = organizationsQuery.map(item => item.initialize());
        const templates = templatesQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageID: 'templates/createTemplate',
            pageTitle: 'Create Template',
            body: new CreateTemplate({
                organizations,
                templates
            })
        });
    
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.status(500).send(new Error.Log(err).response());
    }
}
