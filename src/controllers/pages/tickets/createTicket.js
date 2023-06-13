const PageTemplate = require('@src/www/templates/standardPage');
const CreateTicket = require('@src/www/content/tickets/createTicket');

module.exports = async (req, res) => {
    const content = new PageTemplate({
        pageTitle: 'Create Ticket',
        body: new CreateTicket().renderToString()
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
