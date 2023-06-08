const database = require('./database');
const GitHubAPI = require('./GitHubAPI');
const AuthService = require('./Auth');
const Backup = require('./Backup');
const FS = require('./FS');
const Prompt = require('./Prompt');
const XMLManager = require('./XMLManager');

module.exports = {
    database,
    GitHubAPI,
    AuthService,
    Backup,
    FS,
    Prompt,
    XMLManager
}
