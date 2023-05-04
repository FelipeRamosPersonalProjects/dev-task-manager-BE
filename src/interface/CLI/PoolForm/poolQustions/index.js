const pickProject = require('./pickProject');
const chooseRepo = require('./chooseRepo');
const chooseRepoFromUser = require('./chooseRepoFromUser');
const chooseBranch = require('./chooseBranch');
const getStash = require('./getStash');
const commitDescription = require('./commitDescription');
const commitChanges = require('./commitChanges');
const pushCommit = require('./pushCommit');

module.exports = {
    pickProject,
    chooseRepo,
    chooseRepoFromUser,
    getStash,
    commitDescription,
    commitChanges,
    pushCommit,
    chooseBranch
};
