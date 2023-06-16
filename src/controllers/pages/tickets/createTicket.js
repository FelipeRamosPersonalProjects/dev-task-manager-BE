const PageTemplate = require('@src/www/templates/standardPage');
const CreateTicket = require('@src/www/content/tickets/createTicket');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const projectsQuery = await CRUD.query({collectionName: 'projects', filter: {}}).defaultPopulate();

    if (projectsQuery instanceof Error.Log || !projectsQuery) {
        return res.status(500).send(projectsQuery.toJSON());
    }

    const projects = projectsQuery.map(item => item.initialize());
    const content = new PageTemplate({
        pageTitle: 'Create Ticket',
        body: new CreateTicket({ fieldName: 'project',  projects}).renderToString()
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
