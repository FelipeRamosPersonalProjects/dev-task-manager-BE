const counters = require('./counters');
const auth_buckets = require('./auth_buckets');
const tickets = require('./tickets');
const users = require('./users');
const repos = require('./repos');
const stashes = require('./stashes');
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
const estimations = require('./estimations');
const sf_configs = require('./sf_configs');
const testing_steps = require('./testing_steps');

module.exports = {
    counters,
            auth_buckets,
            tickets,
            users,
            repos,
            stashes,
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
            estimations,
            sf_configs,
    testing_steps
};
