const PageTemplate = require('@src/www/pages/standardPage');
const ProjectCreate = require('@src/www/content/projects/create');
const ErrorPage = require('@src/www/error');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const spacesQuery = await CRUD.query({collectionName: 'space_desks', filter: { owner: req.session.currentUser._id }});
        if (spacesQuery instanceof Error.Log || !spacesQuery) {
            return res.status(500).send(spacesQuery.toJSON());
        }

        const spaces = spacesQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageID: 'projects/create',
            pageTitle: 'Create Project',
            body: new ProjectCreate({
                spaces
            })
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
