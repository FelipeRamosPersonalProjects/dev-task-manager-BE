const pickProject = require('./pickProject');
const chooseRepo = require('./chooseRepo');
const chooseRepoFromUser = require('./chooseRepoFromUser');
const getStash = require('./getStash');
const commitDescription = require('./commitDescription');
const commitChanges = require('./commitChanges');

module.exports = {
    pickProject,
    chooseRepo,
    chooseRepoFromUser,
    getStash,
    commitDescription,
    commitChanges
};
