const PageTemplate = require('@src/www/pages/standardPage');
const CreateEstimation = require('@src/www/content/estimations/createEstimation');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const ticketsQuery = await CRUD.query({collectionName: 'tickets', filter: { assignedUsers: { $in: [ req.session.currentUser._id ] } }}).defaultPopulate();
    const tasksQuery = await CRUD.query({collectionName: 'tasks', filter: { assignedUsers: { $in: [ req.session.currentUser._id ] } }}).defaultPopulate();

    if (ticketsQuery instanceof Error.Log) {
        throw ticketsQuery;
    }

    if (tasksQuery instanceof Error.Log) {
        throw tasksQuery;
    }

    const tickets = ticketsQuery.map(item => item.initialize());
    const tasks = tasksQuery.map(item => item.initialize());
    const content = new PageTemplate({
        pageID: 'estimations/createEstimation',
        pageTitle: 'Create Estimation',
        body: new CreateEstimation({
            tickets,
            tasks
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
