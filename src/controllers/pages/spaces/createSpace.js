const PageTemplate = require('@src/www/pages/standardPage');
const SpaceCreate = require('@src/www/content/spaces/createSpace');
const ErrorPage = require('@src/www/error');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const templatesQuery = await CRUD.query({ collectionName: 'templates' });
        if (templatesQuery instanceof Error.Log || !templatesQuery) {
            return res.status(500).send(templatesQuery.toJSON());
        }

        const templates = templatesQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageID: 'spaces/createSpace',
            pageTitle: 'Create Space',
            body: new SpaceCreate({
                templates,
                jiraProjects: req.session.currentUser.jira.projects.values
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
