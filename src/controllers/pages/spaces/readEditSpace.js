const PageTemplate = require('@src/www/pages/standardPage');
const ErrorPage = require('@src/www/error');
const ReadEditSpace = require('@src/www/content/spaces/readEditSpace');
const CRUD = require('@CRUD');

module.exports = async (req, res) => {
    try {
        const projectsQuery = await CRUD.query({collectionName: 'projects', filter: {}}).defaultPopulate();
        if (projectsQuery instanceof Error.Log || !projectsQuery) {
            return res.status(500).send(projectsQuery.toJSON());
        }

        const templatesQuery = await CRUD.query({collectionName: 'templates', filter: {}}).defaultPopulate();
        if (templatesQuery instanceof Error.Log || !templatesQuery) {
            return res.status(500).send(templatesQuery.toJSON());
        }

        const usersQuery = await CRUD.query({collectionName: 'users', filter: {}}).defaultPopulate();
        if (usersQuery instanceof Error.Log || !usersQuery) {
            return res.status(500).send(usersQuery.toJSON());
        }

        const spaceDoc = await CRUD.getDoc({collectionName: 'space_desks', filter: { index: req.params.index }}).defaultPopulate();
        if (!spaceDoc) {
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(new ErrorPage({
                code: '404',
                name: 'Document not found',
                message: `The space "${req.params.index}" requested wasn't found!`
            }).renderToString());
        }

        if (spaceDoc instanceof Error.Log) {
            throw spaceDoc;
        }

        const projects = projectsQuery.map(item => item.initialize());
        const templates = templatesQuery.map(item => item.initialize());
        const users = usersQuery.map(item => item.initialize());
        const content = new PageTemplate({
            pageID: 'spaces/readEditSpace',
            pageTitle: 'Edit Space',
            body: new ReadEditSpace({
                projects,
                users,
                templates,
                spaceDoc: spaceDoc.initialize()
            })
        });

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content.renderToString());
    } catch (err) {
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(new ErrorPage(err).renderToString());
    }
}
