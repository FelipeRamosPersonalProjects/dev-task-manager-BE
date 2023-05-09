const crud = require('./crud');
const tasks = require('./tasks');
const tickets = require('./tickets');
const pullRequests = require('./pullRequests');
const menus = require('./menus');
const stashesBackups = require('./stashesBackups');
const repoManager = require('./repoManager');
const user = require('./user');
const authView = require('./authView');
const home = require('./home');
const docDisplay = require('./docDisplay');

module.exports = {
    crud,
    tasks,
    tickets,
    pullRequests,
    menus,
    stashesBackups,
    repoManager,
    user,
    authView,
    home,
    docDisplay
};
