const PageTemplate = require('@src/www/pages/standardPage');
const CreatePullRequest = require('@src/www/content/pullrequests/createPullRequest');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const userUID = req.getSafe('session.currentUser._id');

    try {
        const ticketsQuery = await CRUD.query({collectionName: 'tickets', filter: {
            assignedUsers: { $in: [ userUID ]}
        }}).defaultPopulate();
        const tickets = ticketsQuery.map(item => item.initialize());

        const tasksQuery = await CRUD.query({collectionName: 'tasks', filter: {
            assignedUsers: { $in: [ userUID ]}
        }}).defaultPopulate();
        const tasks = tasksQuery.map(item => item.initialize());

        const usersQuery = await CRUD.query({collectionName: 'users'}).defaultPopulate();
        const users = usersQuery.map(item => item.initialize());

        const labelsQuery = await CRUD.query({collectionName: 'labels'}).defaultPopulate();
        const labels = labelsQuery.map(item => item.initialize());

        const reviwersQuery = await CRUD.query({collectionName: 'users'}).defaultPopulate();
        const reviwers = reviwersQuery.map(item => item.initialize());

        const content = new PageTemplate({
            pageID: 'pullrequests/createPullRequest',
            pageTitle: 'Create PullRequest',
            body: new CreatePullRequest({
                tickets,
                tasks,
                users,
                labels,
                reviwers
            })
        });
    
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(err);
    }
}
