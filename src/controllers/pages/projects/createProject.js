const PageTemplate = require('@src/www/templates/standardPage');
const ProjectCreate = require('@src/www/content/projects/create');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const spaces = await CRUD.query({collectionName: 'space_desks'});
    
        const content = new PageTemplate({
            pageTitle: 'Create Project',
            body: new ProjectCreate({
                spaces
            }).renderToString()
        });
    
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        debugger;
    }
}
