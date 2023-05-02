const fetch = require('./fetch');
const commit = require('./commit');
const push = require('./push');
const pull = require('./pull');
const createBranch = require('./createBranch');

module.exports = {
    fetch,
    commit,
    push,
    pull,
    createBranch
};
