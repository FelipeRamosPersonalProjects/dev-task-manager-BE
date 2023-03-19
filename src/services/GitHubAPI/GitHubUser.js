const GitHubConnection = require('./GitHubConnection');
const config = require('../../../config.json');

class GitHubUser extends GitHubConnection {
    constructor (setup) {
        super(setup);
    }

    async getUser() {
        try {
            const response = await ajax(`${this.apiHostURL}/users/${config.github.testUser}`, {
                headers: { Authorization: `Token ${this.getGITHUB_USER_TOKEN()}` }
            }).get();

            return response;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GitHubUser;
