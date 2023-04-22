const crud = require('./crud');
const tasks = require('./tasks');
const tickets = require('./tickets');
const pullRequests = require('./pullRequests');
const home = require('./home');
const ticketsAndTasks = require('./ticketsAndTasks');
const prs_menu = require('./prs-menu');
const create_pr = require('./create-pr');
const docDisplay = require('./docDisplay');

module.exports = {
    crud,
    tasks,
    tickets,
    pullRequests,
    home,
    ticketsAndTasks,
    prs_menu,
    create_pr,
    docDisplay
};
