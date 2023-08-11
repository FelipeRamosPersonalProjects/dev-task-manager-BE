const begin = require('./begin');
const prepare = require('./prepare');
const commit = require('./commit');
const publish = require('./publish');
const changesDescription = require('./changesDescription');
const createPR = require('./createPR');

module.exports = {
    begin,
    prepare,
    commit,
    publish,
    changesDescription,
    createPR
};
