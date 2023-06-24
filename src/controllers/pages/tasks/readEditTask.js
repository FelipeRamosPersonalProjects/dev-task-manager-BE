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

        const projectsQuery = await CRUD.query({collectionName: 'projects'}).defaultPopulate();
        if (projectsQuery instanceof Error.Log || !projectsQuery) {
            return res.status(500).send(projectsQuery.toJSON());
        }

        const reposQuery = await CRUD.query({collectionName: 'repos', filter: { projects: { $in: [taskDoc.getSafe('project.id')] } }}).defaultPopulate();
        if (reposQuery instanceof Error.Log || !reposQuery) {
            return res.status(500).send(reposQuery.toJSON());
        }

        const repos = reposQuery.map(item => item.initialize());
        const projects = projectsQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageTitle: 'Edit Task',
            body: new ReadEditTask({
                repos,
                projects,
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
