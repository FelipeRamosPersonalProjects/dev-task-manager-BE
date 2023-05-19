const GitHubConnection = require('@services/GitHubAPI/GitHubConnection');
const User = require('@models/collections/User');

class GitHubPRSync extends GitHubConnection {
    constructor(setup) {
        try {
            super(setup);

            this.opened = [];
            this.remote = [];
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async init() {
        try {
            const opened = await this.getOpened();
            if (opened instanceof Error.Log) {
                throw opened;
            }
            
            
            this.opened = opened;
            const remote = await this.getRemote();
            if (remote instanceof Error.Log) {
                throw remote;
            }

            this.remote = remote;
            return this;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async sync() {
        try {
            await this.init();
            const success = [];
            
            for (let item of this.opened) {
                const currentRemote = this.remote.find(remo => item.gitHubPR.number === remo.number);

                if (currentRemote && JSON.stringify(currentRemote) !== JSON.stringify(item.gitHubPR)) {
                    success.push(item.updateDB({collectionName: 'pull_requests', data: {
                        gitHubPR: currentRemote
                    }}));
                }
            }

            return Promise.all(success);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async getOpened() {
        try {
            const user = await User.getMyUser();
            const opened = await user.loadOpenedPRs();

            return opened;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async getRemote() {
        try {
            if (!Array.isArray(this.opened)) {
                this.opened = await this.getOpened();
            }

            for (let item of this.opened) {
                if (item.gitHubPR.number) {
                    const remote = await this.ajax(item.gitHubPR.url, null, {rawURL: true});
                    if (remote instanceof Error.Log) {
                        throw remote;
                    }
          
                    this.remote.push(remote);
                }
            }

            return this.remote;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GitHubPRSync;
