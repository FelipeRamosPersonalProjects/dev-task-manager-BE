const GlobalClass = require('./GlobalClass');
const logs = require('./LogsClass');
const users = require('./UsersClass');
const tickets = require('./TicketsClass');
const comments = require('./CommentsClass');
const projects = require('./ProjectsClass');
const pull_requests = require('./PullRequestsClass');
const repos = require('./ReposClass');
const components = require('./ComponentsClass');
const tasks = require('./TasksClass');

module.exports = {
    GlobalClass,
    logs,
    tickets,
    comments,
    projects,
    pull_requests,
    repos,
    components,
    tasks,
    users
};
