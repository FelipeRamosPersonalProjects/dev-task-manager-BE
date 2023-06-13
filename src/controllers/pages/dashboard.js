const Page = require('@src/www/templates/standardPage');
const Dashboard = require('@www/content/dashboard');

module.exports = async (req, res) => {
    const content = new Page({
        pageTitle: 'Dashboard Page',
        body: new Dashboard().renderToString()
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
