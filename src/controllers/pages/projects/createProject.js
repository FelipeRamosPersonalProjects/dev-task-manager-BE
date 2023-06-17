const PageTemplate = require('@src/www/layouts/standardPage');
const ProjectCreate = require('@src/www/content/projects/create');
const ErrorPage = require('@src/www/error');
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
        const errorPage = new ErrorPage({
            code: '500',
            name: err.name,
            message: err.message
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(errorPage.renderToString());
    }
}
