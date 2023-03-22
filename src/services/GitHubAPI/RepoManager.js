const { Prompt } = require('..');
const { GitHubConnection } = require('.');

class RepoManager extends GitHubConnection {
    constructor(setup = {
        ...this,
        repoName: '',
        repoPath: '',
        localPath: ''
    }) {
        super(setup);
        const { repoName, repoPath, localPath } = setup || {};

        this.repoName = repoName;
        this.repoPath = repoPath;
        this.localPath = localPath;
        this.prompt = new Prompt({
            rootPath: this.localPath
        });
    }

    async isBranchExist(branchName) {
        return;
    }

    async checkout(branchName, options) {
        try {
            const { bringChanges } = options || {};
            const isExist = await this.isBranchExist(branchName);
            const params = bringChanges ? '-b ' : '';

            if (!branchName) {
                return new Error.Log({});
            }

            if (isExist) {
                branchName += '-v2';
            }

            return new Promise((resolve, reject) => {
                try {
                    const out = this.prompt.cmd(`git checkout ${params}${branchName}`);
                    return resolve(out);
                } catch(err) {
                    return reject(err);
                }
            });
        } catch(err) {
            throw new Error.Log({});
        }
    }

    async addChanges(params) {
        try {
            return new Promise((resolve, reject) => {
                try {
                    const out = this.prompt.cmd(`git add .${this.prompt.strigifyParams(params)}`);
                    return resolve(out);
                } catch(err) {
                    return reject(err);
                }
            });
        } catch(err) {
            throw new Error.Log({});
        }
    }

    async commit(description, params) {
        try {
            return new Promise((resolve, reject) => {
                try {
                    const out = this.prompt.cmd(`git commit -m "${description}"${this.prompt.strigifyParams(params)}`);
                    return resolve(out);
                } catch(err) {
                    return reject(err);
                }
            });
        } catch(err) {
            throw new Error.Log({});
        }
    }

    async push() {
        try {
            return new Promise((resolve, reject) => {
                try {
                    const out = this.prompt.cmd(`git push${this.prompt.strigifyParams(params)}`);
                    return resolve(out);
                } catch(err) {
                    return reject(err);
                }
            });
        } catch(err) {
            throw new Error.Log({});
        }
    }

    buildPullRequest() {
        return Object;
    }
}

module.exports = RepoManager;
