const PageTemplate = require('@src/www/pages/standardPage');
const CreateTask = require('@src/www/content/tasks/createTask');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    const content = new PageTemplate({
        pageTitle: 'Create Task',
        body: new CreateTask({
        })
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
