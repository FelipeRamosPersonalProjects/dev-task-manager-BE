const config = require('@config');

class GitHubUser {
    constructor(setup) {
        try {
            const { userName } = Object(setup);

            this.userName = userName;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async getUser() {
        try {
            const response = await this.ajax(`/user`);

            if (response instanceof Error.Log) {
                throw response;
            }

            return response;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GitHubUser;
