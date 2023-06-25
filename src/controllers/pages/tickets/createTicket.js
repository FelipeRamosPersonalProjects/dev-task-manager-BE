const PageTemplate = require('@src/www/pages/standardPage');
const CreateTicket = require('@src/www/content/tickets/createTicket');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const projectsQuery = await CRUD.query({collectionName: 'projects'}).defaultPopulate();
    if (projectsQuery instanceof Error.Log || !projectsQuery) {
        return res.status(500).send(projectsQuery.toJSON());
    }

    const spacesQuery = await CRUD.query({collectionName: 'space_desks'});
    if (spacesQuery instanceof Error.Log || !spacesQuery) {
        return res.status(500).send(spacesQuery.toJSON());
    }

    const projects = projectsQuery.map(item => item.initialize());
    const spaces = spacesQuery.map(item => item.initialize());
    const content = new PageTemplate({
        pageID: 'tickets/createTicket',
        pageTitle: 'Create Ticket',
        body: new CreateTicket({
            projects,
            spaces
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
