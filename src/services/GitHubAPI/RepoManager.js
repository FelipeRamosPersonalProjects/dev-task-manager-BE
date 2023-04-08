const Prompt = require('../Prompt');
const GitHubConnection = require('./GitHubConnection');
const Stash = require('../../models/collections/Stash');
const StringTemplateBuilder = require('../../interface/StringTemplateBuilder');

class RepoManager extends GitHubConnection {
    constructor(setup = {
        ...this,
        repoName: '',
        repoPath: '',
        localPath: ''
    }, parent) {
        super(setup);
        const { repoName, repoPath, localPath } = setup || {};

        this.repoName = repoName;
        this.repoPath = repoPath;
        this.localPath = localPath;
        this.prompt = new Prompt({
            rootPath: this.localPath
        });

        this.parent = () => parent;
    }

    getCurrentBranch() {
        try {
            const branch = this.prompt.cmd('git branch --show-current');
            const regex = /[\n\t\r ]/g;

            if (branch.error) {
                throw new Error.Log(branch);
            }

            if (branch.out) {
                branch.out = branch.out.replace(regex, '');
            }

            if (branch.success) {
                return branch.out;
            }
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.get_current_branch');
        }
    }

    async isBranchExist(branchName) {
        try {
            const isLocalExist = this.isLocalBranchExist(branchName);
            const isRemoteExist = await this.isRemoteBranchExist(branchName);

            return {
                isExist: (isLocalExist || isRemoteExist.success),
                isRemoteExist: isRemoteExist.success && isRemoteExist.isExist || false,
                remoteData: !isRemoteExist.branchData.error && isRemoteExist.branchData,
                isLocalExist
            };
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.is_branch_exist');
        }
    }

    isLocalBranchExist(branchName) {
        try {
            const isLocalExist = this.prompt.cmd('git show-ref --verify --quiet refs/heads/' + branchName);

            if (isLocalExist.error) {
                return false
            }

            return true;
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.is_local_branch_exist');
        }
    }

    async isRemoteBranchExist(branchName) {
        try {
            const response = await this.ajax(`/repos/${this.repoPath}/branches/${branchName}`);
            
            return {
                success: (!response.error),
                isExist: (!response.error && response.name === 'Not Found'),
                branchData: !response.error && response,
            }
        } catch (err) {
            if (err.status === 404 && err.name === 'Not Found') {
                return false;
            } else {
                throw new Error.Log(err).append('services.GitHubAPI.RepoManager.is_remote_branch_exist');
            }
        }
    }

    async createBranch(name, baseName, options) {
        const { bringChanges } = options || {};

        try {
            const branch = await this.isBranchExist(name);
            const currentBranch = this.getCurrentBranch();

            if (currentBranch !== baseName) {
                return new Error.Log('services.GitHubAPI.RepoManager.base_branch_is_not_current');
            }

            if (branch.isExist) {
                return new Error.Log('services.GitHubAPI.RepoManager.branch_is_exist', name, branch);
            }

            const prompt = await this.prompt.exec(`git branch ${name} ${baseName}`);

            if (prompt instanceof Error.Log) {
                throw prompt;
            }

            if (prompt.success) {
                const checkout = await this.checkout(name, { bringChanges });
                return checkout;
            }
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.creating_branch');
        }
    }

    buildStashName({_id, type}) {
        return `${_id}__${type}`;
    }

    async createStash(setup) {
        const { type, name, description, taskUID, repoUID } = setup || {};

        try {
            const currentBranch = this.getCurrentBranch();
            const parent = this.parent();
            const repo = repoUID || parent && parent._id;

            if (!repo) {
                throw new Error.Log('services.GitHubAPI.RepoManager.repo_uid_required');
            }

            // Creating stash on database
            const newStash = await Stash.create({ type, name, description, repo, branch: currentBranch, task: taskUID });
            if (newStash instanceof Error.Log) {
                throw newStash;
            }

            // Adding changes
            const added = this.addChanges();
            if (added instanceof Error.Log) {
                throw added;
            }

            // Creating stash
            const stashed = await this.stash(this.buildStashName(newStash));
            if (stashed instanceof Error.Log) {
                throw stashed;
            }

            return newStash;
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.creating_stash');
        }
    }

    async getStash(filter) {
        try {
            const stashesList = this.prompt.cmd(`git stash list`);
            const validFilter = stashesList.out.split('\n').filter(item => item);
            const stashes = await Stash.load(filter);
    
            for (const stash of stashes) {
                validFilter.map(item =>{
                    const [prefix, _, name] = item.split(': ');
                    const stashIndex = prefix.replace('stash@{', '').replace('}', '');
                    const [_id] = name.split('__');
    
                    if (stash._id === _id) {
                        return stash.setIndex(stashIndex);
                    }
                });
            }
    
            if (typeof filter === 'string') {
                const stash = stashes.find(item => item._id === filter);
                return stash;
            } else {
                return stashes;
            }
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.getting_stash');
        }
    }

    async applyStash(filter) {
        try {
            const currentChanges = await this.currentChanges();

            if (currentChanges instanceof Error.Log) {
                return currentChanges;
            }

            if (currentChanges.changes.length) {
                await this.createStash({
                    type: 'backup',
                    name: 'auto-backup-' + Date.now(),
                    description: `Autostash done to avoid loose unstashed changes when it's applying another stash`,
                    repoUID: this.parent()._id
                });
            }

            const { stashIndex } = await this.getStash(filter) || {};
            const applied = await this.prompt.exec(`git stash apply${stashIndex ? ` --index ${stashIndex}` : ''}`);

            if (applied instanceof Error.Log) {
                return applied;
            }

            if (applied.success) {
                return applied;
            }
        } catch (err) {
            return new Error.Log(err).append('services.GitHubAPI.RepoManager.apply_stash');
        }
    }

    async stash(stashName) {
        try {
            const stashed = await this.prompt.exec(`git stash save "${stashName}"`);
            
            if (stashed instanceof Error.Log) {
                throw stashed;
            }

            if (stashed.success) {
                return stashed;
            }
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.saving_stash');
        }
    }

    async checkout(branchName, options) {
        const { bringChanges } = options || {};

        try {
            const branch = await this.isBranchExist(branchName);
            const currentBranch = this.getCurrentBranch();

            if (branchName === currentBranch) {
                return new Error.Log('services.GitHubAPI.RepoManager.checkout_branch_is_current', branchName);
            }

            if (!branch.isExist) {
                return new Error.Log('services.GitHubAPI.RepoManager.checkout_branch_not_found', branchName);
            }

            if (!branch.isLocalExist) {
                return new Error.Log('services.GitHubAPI.RepoManager.checkout_local_branch_not_found', branchName);
            }

            
            const stashed = await this.createStash({ type: bringChanges && 'bring' });
            if (stashed instanceof Error.Log) {
                throw stashed.append('services.GitHubAPI.RepoManager.checkout_stashing_error');
            }

            const out = await this.prompt.exec(`git checkout ${branchName}`);
            let message = out.out;
            if (out instanceof Error.Log) {
                return out.append('services.GitHubAPI.RepoManager.checkout_git_error');
            }
            
            if (bringChanges && stashed.type === 'bring') {
                const apply = await this.applyStash(stashed._id);
                
                if (apply instanceof Error.Log) {
                    const isNoEntriesError = apply.message.indexOf('Command failed: git stash apply\nNo stash entries found.\n') > -1;

                    if (!isNoEntriesError) {
                        throw apply;
                    }

                    return apply;
                }

                if (apply.success) {
                    message += apply.out + '\n';
                }
            }

            return {
                success: true,
                out: message
            };
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.checkout');
        }
    }

    addChanges() {
        try {
            const out = this.prompt.cmd(`git add .`);
            return out;
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.add_changes');
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
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.current_changes');
        }
    }

    async commit(title, description, params) {
        try {
            let stringFilesList = new StringTemplateBuilder().text(description).newLine().newLine();

            const fileChanges = await this.currentChanges();
            if (fileChanges instanceof Error.Log) {
                throw fileChanges;
            }

            fileChanges.changes.map(item => {
                stringFilesList = stringFilesList.text(`### ${item.filePath}:`).newLine().newLine();
            });
            stringFilesList = stringFilesList.end();

            const added = await this.addChanges();
            if (added instanceof Error.Log) {
                throw added;
            }

            const out = await this.prompt.exec(`git commit -m "${title}" -m "${stringFilesList}"${this.prompt.strigifyParams(params)}`);
            if (out instanceof Error.Log) {
                throw out;
            }

            return out;
        } catch(err) {
            return new Error.Log(err).append('services.GitHubAPI.RepoManager.commiting');
        }
    }

    async push(params) {
        try {
            const branchName = this.getCurrentBranch();
            const out = await this.prompt.exec(`git push --set-upstream origin ${branchName}${this.prompt.strigifyParams(params)}`);
            return out;
        } catch (err) {
            return new Error.Log(err).append('services.GitHubAPI.RepoManager.pushing');
        }
    }

    async createPullRequest(data) {
        try {
            const PR = await this.ajax(
                `/repos/${this.repoPath}/pulls`,
                data,
                'POST'
            );

            if (PR instanceof Error.Log) {
                throw PR;
            }

            if (Array.isArray(data.assignees)) {
                const addAssignees = await this.ajax(`/repos/${this.repoPath}/issues/${PR.number}/assignees`, {
                    assignees: data.assignees
                }, 'POST');

                if (addAssignees instanceof Error.Log) {
                    throw addAssignees;
                }
            }
            
            if (Array.isArray(data.labels)) {
                const addLabels = await this.ajax(`/repos/${this.repoPath}/issues/${PR.number}/labels`, {
                    labels: data.labels
                }, 'POST');

                if (addLabels instanceof Error.Log) {
                    throw addLabels;
                }
            }

            return PR;
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.creating_pull_request');
        }
    }
}

module.exports = RepoManager;
