const user = require('./user');
const tickets = require('./tickets');
const tasks = require('./tasks');
const estimations = require('./estimations');
const pullrequests = require('./pullrequests');
const validations = require('./validations');
const projects = require('./projects');
const repos = require('./repos');
const spaces = require('./spaces');
const dashboard = require('./dashboard');

module.exports = {
    dashboard,
    tickets,
    tasks,
    estimations,
    pullrequests,
    validations,
    projects,
    repos,
    spaces,
    user
}
