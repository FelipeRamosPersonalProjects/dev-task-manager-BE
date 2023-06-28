const tickets = require('./tickets.workflow');
const tasks = require('./tasks.workflow');
const projects = require('./projects.workflow');
const estimations = require('./estimations.workflow');
const pullrequests = require('./pullrequests.workflow');
const validations = require('./validations.workflow');

module.exports = {
    tickets,
    tasks,
    projects,
    estimations,
    pullrequests,
    validations
};
