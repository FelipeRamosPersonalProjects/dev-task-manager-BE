const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditTemplate = require('@src/www/content/templates/readEditTemplate');

module.exports = async (req, res) => {
    try {
        const content = new PageTemplate({
            pageID: 'templates/readEditTemplate',
            pageTitle: 'Edit Template',
            body: new ReadEditTemplate({
                collection: 'templates'
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
