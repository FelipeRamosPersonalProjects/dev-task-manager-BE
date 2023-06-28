const Page = require('@src/www/pages/standardPage');
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

    const reposQuery = await CRUD.query({collectionName: 'repos', filter: {
        collaborators: { $in: [ user._id ]}
    }}).defaultPopulate();
    const repos = reposQuery.map(item => item.initialize());

    const spacesQuery = await CRUD.query({ collectionName: 'space_desks', owner: user._id });
    const spaces = spacesQuery.map(item => item.initialize());

    const estimationsQuery = await CRUD.query({ collectionName: 'estimations', assignedUsers: { $in: [user._id] } }).defaultPopulate();
    const estimations = estimationsQuery.map(item => item.initialize());

    const content = new Page({
        pageTitle: 'Dashboard Page',
        body: new Dashboard({
            tickets,
            tasks,
            pullRequests,
            projects,
            spaces,
            repos,
            estimations
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
