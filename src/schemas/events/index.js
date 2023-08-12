const tickets = require('./tickets_events');
const tasks = require('./tasks_events');
const users = require('./users_events');
const auth_buckets = require('./auth_buckets_events');
const estimations = require('./estimations_events');
const pull_requests = require('./pull_requests_events');

module.exports = {
    tickets,
    tasks,
    users,
    auth_buckets,
    estimations,
    pull_requests
};
