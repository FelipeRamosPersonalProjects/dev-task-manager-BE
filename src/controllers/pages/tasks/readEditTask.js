const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditTask = require('@src/www/content/tasks/readEditTask');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const taskDoc = await CRUD.getDoc({collectionName: 'tasks', filter: { index: req.params.index }}).defaultPopulate();
        if (!taskDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The task "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (taskDoc instanceof Error.Log) {
            throw taskDoc;
        }

        const content = new PageTemplate({
            pageTitle: 'Edit Task',
            body: new ReadEditTask({
                fieldName: 'project',
                projects,
                spaces,
                formState: 'read',
                taskDoc: taskDoc.initialize()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
