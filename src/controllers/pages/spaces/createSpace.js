const PageTemplate = require('@src/www/pages/standardPage');
const SpaceCreate = require('@src/www/content/spaces/createSpace');
const ErrorPage = require('@src/www/error');

module.exports = async (req, res) => {
    try {
        const content = new PageTemplate({
            pageTitle: 'Create Space',
            body: new SpaceCreate({
                jiraProjects: req.session.currentUser.jira.projects.values
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
