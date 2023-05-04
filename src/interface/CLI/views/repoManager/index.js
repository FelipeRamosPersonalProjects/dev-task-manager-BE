const createBranch = require('./createBranch');
const checkoutBranch = require('./checkoutBranch');
const fetch = require('./fetch');
const commit = require('./commit');
const push = require('./push');
const pull = require('./pull');

module.exports = {
    fetch,
    commit,
    push,
    pull,
    createBranch,
    checkoutBranch,
};
