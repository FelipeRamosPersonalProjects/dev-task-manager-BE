const PageTemplate = require('@src/www/pages/standardPage');
const CreateValidation = require('@src/www/content/validations/CreateValidation');
const schemas = require('@schemas');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const ticketsQuery = await CRUD.query({ collectionName: 'tickets', filter: { assignedUsers: { $in: [req.session.currentUser._id] } }});
        const tasksQuery = await CRUD.query({ collectionName: 'tasks', filter: { assignedUsers: { $in: [req.session.currentUser._id] } }});

        const tickets = ticketsQuery.map(item => item.initialize());
        const tasks = tasksQuery.map(item => item.initialize());
        const instances = Object(schemas).getSafe('validations.schema.obj.instance.enum');
        const content = new PageTemplate({
            pageID: 'validations/CreateValidation',
            pageTitle: 'Create PullRequest',
            body: new CreateValidation({
                tickets,
                tasks,
                instances: Array.isArray(instances) && instances.map(item => ({ label: item, value: item }))
            })
        });
    
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.status(500).send(new Error.Log(err).toJSON())
    }
}
