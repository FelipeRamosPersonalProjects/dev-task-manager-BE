const tasks = require('./tasks_query');
const tickets = require('./tickets_query');
const repos = require('./repos_query');
const pull_requests = require('./pull_requests_query');
const stashes = require('./stashes_query');
const projects = require('./projects_query');
const space_desks = require('./space_desks_query');
const estimations = require('./estimations_query');
const validations = require('./validations_query');
const labels = require('./labels_query');
const organizations = require('./organizations_query');
const templates = require('./templates_query');
const users = require('./users_query');

module.exports = {
    tasks,
    tickets,
    repos,
    pull_requests,
    stashes,
    projects,
    space_desks,
    estimations,
    validations,
    labels,
    organizations,
    templates,
    users
};
