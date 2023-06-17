const PageTemplate = require('@src/www/layouts/standardPage');
const ReadEditTicket = require('@src/www/content/tickets/readEditTicket');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const projectsQuery = await CRUD.query({collectionName: 'projects', filter: {}}).defaultPopulate();
    if (projectsQuery instanceof Error.Log || !projectsQuery) {
        return res.status(500).send(projectsQuery.toJSON());
    }

    const spacesQuery = await CRUD.query({collectionName: 'space_desks'});
    if (spacesQuery instanceof Error.Log || !spacesQuery) {
        return res.status(500).send(spacesQuery.toJSON());
    }

    const ticketDoc = await CRUD.getDoc({collectionName: 'tickets', filter: { index: req.params.index }}).defaultPopulate();
    if (ticketDoc instanceof Error.Log || !ticketDoc) {
        return res.status(500).send(ticketDoc.toJSON());
    }

    const projects = projectsQuery.map(item => item.initialize());
    const spaces = spacesQuery.map(item => item.initialize());
    const content = new PageTemplate({
        pageTitle: 'Edit Ticket',
        body: new ReadEditTicket({ fieldName: 'project',  projects, spaces, ticketDoc: ticketDoc.initialize()}).renderToString()
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
