const GitHubSync = require('./GitHubSync');

class Sync {
    constructor(setup) {
        try {            
            this.gitHub = new GitHubSync(setup);
            this.jira = {};
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async async() {
        try {
            return await this.gitHub.syncAll();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Sync;
