const GitHubSync = require('./GitHubSync');
const auth = require('@CLI/helpers/auth');
const FS = require('@services/FS');
const Config = require('@config');
const CLI = require('@interface/CLI');

class Sync {
    constructor(setup) {
        try {            
            this.gitHub = new GitHubSync(setup);
            this.jira = {};
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async fullSync() {
        try {
            const isSessionExist = FS.isExist(Config.sessionPath);
            const session = Object(isSessionExist && require('@SESSION_CLI'));
            const currentUser = session.currentUser;
            const token = currentUser && session[currentUser] && session[currentUser].token;
        
            if (await auth.isAuthenticated(token)) {
                return await this.gitHub.syncAll();
            } else {
                return await new CLI({
                    startView: 'user/authView',
                    startViewParams: { token }
                }).init();
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Sync;
