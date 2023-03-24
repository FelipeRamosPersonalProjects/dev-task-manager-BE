const Prompt = require('../Prompt');
const GitHubConnection = require('./GitHubConnection');
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
        try {
            const out = this.prompt.cmd('git show-ref --verify --quiet refs/heads/' + branchName);

            if (out.error) {
                return false
            }

            return true;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async checkout(branchName, options) {
        try {
            const { leaveChanges } = options || {};
            const isExist = await this.isBranchExist(branchName);
            const params = !leaveChanges ? '-b ' : '';

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

    async currentChanges(params) {
        try {
            const consoleResult = await this.prompt.exec(`git --no-pager diff --staged${this.prompt.strigifyParams(params)}`);
            const regex = /diff --git a\/(.*?)\s/;

            if (consoleResult.success) {
                const {out} = consoleResult;
                const result = {
                    success: true,
                    rawDiff: out,
                    changes: []
                };

                out.split('@@').map(item => {
                    const match = item.match(regex);
                    
                    if (match && match[1]) {
                        const url = match[1];
                        result.changes.push({
                            filePath: url
                        });
                    }
                });

                return result;
            } else {
                return new Error.Log(consoleResult);
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    async commit(description, params) {
        try {
            const fileChanges = await this.currentChanges();
            let stringFilesList = description || '';
            
            fileChanges.changes.map(item => {
                stringFilesList += '- ' + item.filePath + '\n'
            });

            const added = await this.addChanges();
            const out = await this.prompt.cmd(`git commit -m "${stringFilesList}"${this.prompt.strigifyParams(params)}`);

            if ([
                fileChanges.success,
                added.success,
                out.success,
            ].every(item => item)){
                return out;
            } else {
                return new Error.Log({});
            }
        } catch(err) {
            return new Error.Log(err);
        }
    }

    async push(branchName, params) {
        try {
            const out = await this.prompt.exec(`git push origin ${branchName}${this.prompt.strigifyParams(params)}`);
            return out;
        } catch(err) {
            return new Error.Log(err);
        }
    }

    createPullRequest() {
        return Object;
    }
}

module.exports = RepoManager;
