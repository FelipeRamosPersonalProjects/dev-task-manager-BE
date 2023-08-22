const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditPullRequest = require('@src/www/content/pullrequests/readEditPullRequest');
const MenuContentSidebarLayout = require('@www/layouts/MenuContentSidebar');
const PullRequestSB = require('@www/sidebars/PullRequestSB');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const pullRequestDoc = await CRUD.getDoc({ collectionName: 'pull_requests', filter: { index: req.params.index }}).defaultPopulate();
        if (!pullRequestDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The pull_request "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (pullRequestDoc instanceof Error.Log) {
            throw pullRequestDoc;
        }

        const pullRequest = pullRequestDoc.initialize();
        const content = new PageTemplate({
            pageID: 'pullrequests/readEditPullRequest',
            pageTitle: 'Edit PullRequest',
            body: new MenuContentSidebarLayout({
                content: new ReadEditPullRequest()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString())
    }
}
