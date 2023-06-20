const PageTemplate = require('@src/www/pages/standardPage');
const CreateEstimation = require('@src/www/content/estimations/createEstimation');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const content = new PageTemplate({
        pageTitle: 'Create Estimation',
        body: new CreateEstimation({
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
