const routes = require('./routes');
const Project = require('./collections/Project');
const Task = require('./collections/Task');
const PullRequest = require('./collections/PullRequest');
const Ticket = require('./collections/Ticket');
const Comment = require('./collections/Comment');
const User = require('./collections/User');

module.exports = {
    routes,
    Project,
    Task,
    PullRequest,
    Ticket,
    Comment,
    User
};
