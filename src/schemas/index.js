const counters = require('./counters');
const auth_buckets = require('./auth_buckets');
const repos = require('./repos');
const tickets = require('./tickets');
const projects = require('./projects');
const tasks = require('./tasks');
const comments = require('./comments');
const space_desks = require('./space_desks');
const organizations = require('./organizations');
const logs = require('./logs');
const threads = require('./threads');
const pull_requests = require('./pull_requests');
const worklogs = require('./worklogs');
const labels = require('./labels');
const code_reviews = require('./code_reviews');
const users = require('./users');
const sf_configs = require('./sf_configs');
const testing_steps = require('./testing_steps');
const stashes = require('./stashes');
const estimations = require('./estimations');
const validations = require('./validations');

module.exports = {
    counters,
    auth_buckets,
    repos,
    tickets,
    projects,
    tasks,
    comments,
    space_desks,
    organizations,
    logs,
    threads,
    pull_requests,
    worklogs,
    labels,
    code_reviews,
    users,
    sf_configs,
    testing_steps,
    stashes,
    estimations,
    validations
};
