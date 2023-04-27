const tasks = require('./tasks_query');
const tickets = require('./tickets_query');
const repos = require('./repos_query');
const pull_requests = require('./pull_requests_query');
const stashes = require('./stashes_query');

module.exports = {
    tasks,
    tickets,
    repos,
    pull_requests,
    stashes
};
