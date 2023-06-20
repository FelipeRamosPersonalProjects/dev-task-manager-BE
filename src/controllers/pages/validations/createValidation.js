const PageTemplate = require('@src/www/pages/standardPage');
const CreatePullRequest = require('@src/www/content/pullrequests/createPullRequest');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const content = new PageTemplate({
        pageTitle: 'Create PullRequest',
        body: new CreatePullRequest({
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
