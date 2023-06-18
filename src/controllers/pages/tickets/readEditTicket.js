const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditTicket = require('@src/www/content/tickets/readEditTicket');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const projectsQuery = await CRUD.query({collectionName: 'projects', filter: {}}).defaultPopulate();
        if (projectsQuery instanceof Error.Log || !projectsQuery) {
            return res.status(500).send(projectsQuery.toJSON());
        }

        const spacesQuery = await CRUD.query({collectionName: 'space_desks'});
        if (spacesQuery instanceof Error.Log || !spacesQuery) {
            return res.status(500).send(spacesQuery.toJSON());
        }

        const ticketDoc = await CRUD.getDoc({collectionName: 'tickets', filter: { index: req.params.index }}).defaultPopulate();
        if (!ticketDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The ticket "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (ticketDoc instanceof Error.Log) {
            throw ticketDoc;
        }

        const projects = projectsQuery.map(item => item.initialize());
        const spaces = spacesQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageTitle: 'Edit Ticket',
            body: new ReadEditTicket({
                fieldName: 'project',
                projects,
                spaces,
                ticketDoc: ticketDoc.initialize()
            }).renderToString()
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
