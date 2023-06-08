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
        let response;

        try {
            if (typeof this.userName === 'string') {
                response = await this.ajax(`/users/${this.userName}`, null, {noToken: true})
            } else {
                response = await this.ajax(`/user`);
            }

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
