const tickets = require('./tickets_events');
const tasks = require('./tasks_events');
const users = require('./users_events');
const auth_buckets = require('./auth_buckets_events');

module.exports = {
    tickets,
    tasks,
    users,
    auth_buckets
};
