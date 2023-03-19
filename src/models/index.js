const routes = require('./routes');
const Project = require('./database/Project');
const Task = require('./database/Task');
const PullRequest = require('./database/PullRequest');
const Ticket = require('./database/Ticket');
const User = require('./database/User');

module.exports = {
    routes,
    Project,
    Task,
    PullRequest,
    Ticket,
    User
};
