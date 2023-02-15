const getProject = require('./get-project');
const createProject = require('./create-project');
const updateProject = require('./update-project');
const deleteProject = require('./delete-project');

async function rootPath(req, res) {
    console.log('root')
}

module.exports = {
    rootPath,
    getProject,
    createProject,
    updateProject,
    deleteProject
}
