const GitHubConnection = require('@services/GitHubAPI/GitHubConnection');
const User = require('@models/collections/User');

class GitHubUserSync extends GitHubConnection {
    constructor(setup) {
        try {
            super(setup);

            this.internal;
            this.remote;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async init() {
        try {
            if (!this.internal || !this.remote) {
                this.internal = await this.loadInternal();
                this.remote = await this.getUser();
            }

            return this;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    isUpToDate() {
        try {
            const internal = JSON.stringify(this.internal.gitHub);
            const remote = JSON.stringify(this.remote);

            if (internal === remote) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async sync() {
        try {
            await this.init();

            if (!this.isUpToDate()) {
                return await this.saveInternal();
            }

            return this.internal;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async loadInternal() {
        try {
            const user = await User.getMyUser();

            if (user instanceof Error.Log) {
                throw user;
            }
            
            return user;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async loadRemote() {
        try {
            return await this.internal.loadGitHubData();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async saveInternal() {
        try {
            await this.init();

            this.internal.updateDB({data: {
                gitHub: this.remote
            }});

            return this.internal;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GitHubUserSync;
