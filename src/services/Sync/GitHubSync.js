const GitHubPR = require('./GitHubPRSync');
const GitHubUserSync = require('./GitHubUserSync');

class GitHubSync {
    constructor(setup) {
        try {
            const { user, pullRequests } = Object(setup);

            this.user = new GitHubUserSync(user);
            this.pullRequests = new GitHubPR(pullRequests);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async syncAll() {
        try {
            const userSync = await this.user.sync();
            const pullRequestSync = await this.pullRequests.sync();

            return {
                userSync,
                pullRequestSync
            }.toSuccess('GitHub features synchronized successfully!');
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GitHubSync;
