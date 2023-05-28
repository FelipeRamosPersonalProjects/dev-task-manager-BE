const counters = require('./counters');
const auth_buckets = require('./auth_buckets');
const users = require('./users');
const repos = require('./repos');
const projects = require('./projects');
const tickets = require('./tickets');
const tasks = require('./tasks');
const pull_requests = require('./pull_requests');
const comments = require('./comments');
const estimations = require('./estimations');
const stashes = require('./stashes');
const space_desks = require('./space_desks');
const organizations = require('./organizations');
const logs = require('./logs');
const threads = require('./threads');
const worklogs = require('./worklogs');
const code_reviews = require('./code_reviews');

module.exports = {
    counters,
    auth_buckets,
    users,
    repos,
    projects,
    tickets,
    tasks,
    pull_requests,
    comments,
    estimations,
    stashes,
    space_desks,
    organizations,
    logs,
    threads,
    worklogs,
    code_reviews
};
