const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditPullRequest = require('@src/www/content/pullrequests/readEditPullRequest');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const content = new PageTemplate({
            pageID: 'pullrequests/readEditPullRequest',
            pageTitle: 'Edit PullRequest',
            body: new ReadEditPullRequest({
                collection: 'pull_requests'
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString())
    }
}
