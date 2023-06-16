const Page = require('@src/www/templates/standardPage');
const Dashboard = require('@www/content/dashboard');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const user = req.session.currentUser;

    const ticketsQuery = await CRUD.query({collectionName: 'tickets', filter: {
        assignedUsers: { $in: [ user._id ]}
    }}).defaultPopulate();
    const tickets = ticketsQuery.map(item => item.initialize());

    const tasksQuery = await CRUD.query({collectionName: 'tasks', filter: {
        assignedUsers: { $in: [ user._id ]}
    }}).defaultPopulate();
    const tasks = tasksQuery.map(item => item.initialize());

    const prsQuery = await CRUD.query({collectionName: 'pull_requests', filter: {
        assignedUsers: { $in: [user._id]},
        $nor: [{ status: 'CLOSED' }]
    }}).defaultPopulate();
    const pullRequests = prsQuery.map(item => item.initialize());

    const projectsQuery = await CRUD.query({collectionName: 'projects'}).defaultPopulate();
    const projects = projectsQuery.map(item => item.initialize());

    const spacesQuery = await CRUD.query({ collectionName: 'space_desks', owner: req.session.currentUser._id });
    const spaces = spacesQuery.map(item => item.initialize());

    const content = new Page({
        pageTitle: 'Dashboard Page',
        body: new Dashboard({
            tickets,
            tasks,
            pullRequests,
            projects,
            spaces
        }).renderToString()
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
