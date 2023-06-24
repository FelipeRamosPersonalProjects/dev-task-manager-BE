const PageTemplate = require('@src/www/pages/standardPage');
const CreateTask = require('@src/www/content/tasks/createTask');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const projectsQuery = await CRUD.query({collectionName: 'projects'}).defaultPopulate();
    if (projectsQuery instanceof Error.Log || !projectsQuery) {
        return res.status(500).send(projectsQuery.toJSON());
    }

    const reposQuery = await CRUD.query({collectionName: 'repos'}).defaultPopulate();
    if (reposQuery instanceof Error.Log || !reposQuery) {
        return res.status(500).send(reposQuery.toJSON());
    }

    const ticketsQuery = await CRUD.query({collectionName: 'tickets', filter: { assignedUsers: { $in: [req.session.currentUser._id] }}}).defaultPopulate();
    if (ticketsQuery instanceof Error.Log || !ticketsQuery) {
        return res.status(500).send(ticketsQuery.toJSON());
    }

    const repos = reposQuery.map(item => item.initialize());
    const projects = projectsQuery.map(item => item.initialize());
    const tickets = ticketsQuery.map(item => item.initialize());
    const content = new PageTemplate({
        pageTitle: 'Create Task',
        body: new CreateTask({
            repos,
            projects,
            tickets
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
