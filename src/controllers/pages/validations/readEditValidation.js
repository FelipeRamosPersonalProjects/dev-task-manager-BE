const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ValidationEdit = require('@src/www/content/validations/ReadEditValidation');
const schemas = require('@schemas');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const ticketsQuery = await CRUD.query({ collectionName: 'tickets', filter: { assignedUsers: { $in: [req.session.currentUser._id] } }});
        const tasksQuery = await CRUD.query({ collectionName: 'tasks', filter: { assignedUsers: { $in: [req.session.currentUser._id] } }});
        const validationDoc = await CRUD.getDoc({collectionName: 'validations', filter: { index: req.params.index }}).defaultPopulate();
        if (!validationDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The validation "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (validationDoc instanceof Error.Log) {
            throw validationDoc;
        }

        
        const tickets = ticketsQuery.map(item => item.initialize());
        const tasks = tasksQuery.map(item => item.initialize());
        const instances = Object(schemas).getSafe('validations.schema.obj.instance.enum');
        const content = new PageTemplate({
            pageID: 'validations/ReadEditValidation',
            pageTitle: 'Edit Validation',
            body: new ValidationEdit({
                formState: 'read',
                tickets,
                tasks,
                instances: Array.isArray(instances) && instances.map(item => ({ label: item, value: item })),
                validationDoc: validationDoc.initialize()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
