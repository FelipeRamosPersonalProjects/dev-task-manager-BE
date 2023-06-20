const user = require('./user');
const ticket = require('./ticket');
const projects = require('./projects');
const repos = require('./repos');
const spaces = require('./spaces');
const dashboard = require('./dashboard');

module.exports = {
    dashboard,
    ticket,
    projects,
    repos,
    spaces,
    user
};
