const counters = require('./counters');
const auth_buckets = require('./auth_buckets');
const projects = require('./projects');
const tasks = require('./tasks');
const repos = require('./repos');
const organizations = require('./organizations');
const threads = require('./threads');
const space_desks = require('./space_desks');
const logs = require('./logs');
const labels = require('./labels');
const code_reviews = require('./code_reviews');
const sf_configs = require('./sf_configs');
const tickets = require('./tickets');
const estimations = require('./estimations');
const validations = require('./validations');
const pull_requests = require('./pull_requests');
const users = require('./users');
const comments = require('./comments');
const testing_steps = require('./testing_steps');
const worklogs = require('./worklogs');
const stashes = require('./stashes');
const templates = require('./templates');

module.exports = {
    counters,
    auth_buckets,
    projects,
    tasks,
    repos,
    organizations,
    threads,
    space_desks,
    logs,
    labels,
    code_reviews,
    sf_configs,
    tickets,
    estimations,
    validations,
    pull_requests,
    users,
    comments,
    testing_steps,
    worklogs,
    stashes,
    templates
};
