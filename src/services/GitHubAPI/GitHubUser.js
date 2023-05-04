const config = require('../../../config.json');

class GitHubUser {
    constructor (setup) {
    }

    async getUser() {
        try {
            const response = await ajax(`${this.repoHostURL}/users/${config.github.testUser}`, {
                headers: { Authorization: `Token ${this.GITHUB_USER_TOKEN}` }
            }).get();

            return response;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GitHubUser;
