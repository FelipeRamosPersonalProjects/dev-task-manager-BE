const Prompt = require('@services/Prompt');
const GitHubConnection = require('./GitHubConnection');
const Compare = require('./Compare');
const FileChange = require('./FileChange');
const StashManager = require('./StashManager');
const ToolsCLI = require('@CLI/ToolsCLI');
const Component = require('@src/interface/Component');

class RepoManager extends GitHubConnection {
    constructor(setup, parent) {
        super(setup);
        const { repoName, repoPath, localPath } = Object(setup);

        this.repoName = repoName;
        this.repoPath = repoPath;
        this.localPath = localPath;

        this.toolsCLI = new ToolsCLI();
        this.prompt = new Prompt({ rootPath: this.localPath });
        this.stashManager = new StashManager({ localPath }, this);

        this.parent = () => parent;
    }

    get repo() {
        return this.parent();
    }

    get parentTask() {
        return this.repo && this.repo.parentTask;
    }

    getCurrentBranch() {
        try {
            const branch = this.prompt.cmd('git branch --show-current', {}, true);
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

    getAllBranches() {
        try {
            const gitBranches = this.prompt.cmd('git --no-pager branch -a', {}, true);
            if (gitBranches instanceof Error.Log) {
                throw gitBranches;
            }

            if (gitBranches.success) {
                const branches = this.parseBranchesList(gitBranches.out).filter(item => item.split('/')[0] !== 'remotes');
                const renderList = new this.toolsCLI.StringBuilder();
                
                renderList.newLine();
                branches.map((item, index) => renderList.text(index + '. ' + item).newLine());
                renderList.end();

                this.toolsCLI.printTemplate(renderList.result);

                return branches;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    parseBranchesList(stringList) {
        const noSpace = stringList.replace(new RegExp(/ /, 'g'), '');
        const list = noSpace.split('\n');

        return list;
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
                isExist: !(response.error && response.name === 'Not Found'),
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

    async findAvailableBranch(branchName, subscription) {
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;

        try {
            const branch = await this.isBranchExist(branchName);

            if (branch.isExist) {
                const increasedVersion = prDoc.version + 1;

                if (prDoc.version < increasedVersion) {
                    prDoc.version = increasedVersion;
                }

                return await this.findAvailableBranch(prDoc.recommendedBranchName, subscription);
            } else {
                return branchName;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createBranch(name, baseName, options) {
        const { bringChanges, backupFolder } = Object(options);
        const subscription = options && options.subscription;
        const progressModal = subscription && subscription.component;
        const prDoc = progressModal && progressModal.prDoc;
        
        let logsCB = options && options.logsCB;
        if (typeof logsCB !== 'function') {
            logsCB = () => {};
        }

        try {
            logsCB(`Creating the new branch "${name}" from "${baseName}"...`);

            const branch = await this.isBranchExist(name);
            if (branch.isExist) {
                const increasedVersion = prDoc.version + 1;

                if (prDoc.version < increasedVersion) {
                    prDoc.version = increasedVersion;
                    prDoc.head = prDoc.recommendedBranchName;
                }

                toolsCLI.print(`Branch name "${name}" already exists!`, 'BRANCH-EXIST');
                toolsCLI.print(`Trying to create the "${prDoc.head}"...`, 'BRANCH-EXIST');
                logsCB(`Branch name "${name}" already exists!`, 'GIT-CLI');
                logsCB(`Trying to create the "${prDoc.head}"...`, 'GIT-CLI');
                return await this.createBranch(prDoc.head, baseName, options);
            }

            const currentBranch = this.getCurrentBranch();
            if (currentBranch !== baseName) {
                const currentError = new Error.Log('services.GitHubAPI.RepoManager.base_branch_is_not_current');
                toolsCLI.print(currentError.message, 'WARN');
                return currentError;
            }

            const prompt = await this.prompt.exec(`git branch ${name} ${baseName}`);

            if (prompt instanceof Error.Log) {
                throw prompt;
            }

            if (prompt.success) {
                const checkout = await this.checkout(name, { bringChanges, backupFolder, logsCB });

                prDoc.updateVersion(prDoc.version).catch(err => subscription.toClientError(err));
                return checkout;
            }
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.creating_branch');
        }
    }

    async checkout(branchName, options) {
        const { bringChanges, backupFolder } = Object(options);
        let logsCB = Object(options).logsCB;

        if (typeof logsCB !== 'function') {
            logsCB = () => {};
        }

        try {
            logsCB('Starting branch checkout...');
            const branch = await this.isBranchExist(branchName);
            const currentBranch = this.getCurrentBranch();

            logsCB('The current branch is ' + currentBranch);
            if (branchName === currentBranch) {
                return new Error.Log('services.GitHubAPI.RepoManager.checkout_branch_is_current', branchName);
            }

            if (!branch.isExist) {
                return new Error.Log('services.GitHubAPI.RepoManager.checkout_branch_not_found', branchName);
            }

            if (!branch.isLocalExist) {
                return new Error.Log('services.GitHubAPI.RepoManager.checkout_local_branch_not_found', branchName);
            }

            logsCB('Creating backup stash...');
            const stashed = await this.stashManager.createStash({
                type: bringChanges ? 'temp' : 'stash',
                ticketUID:  this.parentTask && this.parentTask.ticket._id,
                taskUID:  this.parentTask && this.parentTask._id,
                backupFolder
            });

            if (stashed instanceof Error.Log) {
                throw stashed.append('services.GitHubAPI.RepoManager.checkout_stashing_error');
            }

            logsCB(`New stash "${stashed.displayName}" created successfully!`);
            logsCB(`Switching to "${branchName}" branch...`);
            const out = await this.prompt.exec(`git checkout ${branchName}`);
            let message = out.out;
            
            logsCB(message, 'GIT-CLI');
            if (out instanceof Error.Log) {
                logsCB(out.stack);
                return out.append('services.GitHubAPI.RepoManager.checkout_git_error');
            }
            
            if (bringChanges && stashed.type === 'temp') {
                logsCB('Applying backup stash...');
                const apply = await this.stashManager.applyStash(stashed._id);
                
                if (apply instanceof Error.Log) {
                    const isNoEntriesError = apply.message.indexOf('Command failed: git stash apply\nNo stash entries found.\n') > -1;

                    if (!isNoEntriesError) {
                        throw apply;
                    }

                    logsCB(apply.stack);
                    return apply;
                }

                if (apply.success) {
                    logsCB(apply.out, 'GIT-CLI');
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
            const added = this.addChanges();
            if (added instanceof Error.Log) {
                return added;
            }

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

                        result.changes.push(new FileChange({
                            filename: url,
                            patch: item
                        }));
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

    async commit(title, summary, params) {
        let { fileChanges, logsCB } = Object(params);

        if (typeof logsCB !== 'function') {
            logsCB = () => {};
        }

        try {
            if (!fileChanges) {
                logsCB('Getting current changes...');

                const fileChanges = await this.currentChanges();
                if (fileChanges instanceof Error.Log) {
                    throw fileChanges;
                }
            }

            if (typeof summary === 'string') {
                summary = summary.replace(/"/g, '**');
            }

            if (Array.isArray(fileChanges)) {
                fileChanges = fileChanges.map(file => {
                    file.description = file.description.replace(/"/g, '**');
                    return file;
                });
            }

            const descriptionTemplate = this.repo.getProjectTemplate('commitDescription');
            const description = (descriptionTemplate instanceof Component) ? descriptionTemplate.renderToString({summary, fileChanges}) : `-m "${summary}"`;
            const added = await this.addChanges();
            if (added instanceof Error.Log) {
                throw added;
            }

            logsCB(added, 'GIT-CLI');
            logsCB('Starting the commit...');
            const out = await this.prompt.exec(`git commit -m "${title}" ${description}`);
            if (out instanceof Error.Log) {
                throw out;
            }

            logsCB(out.out, 'GIT-CLI');
            return {
                success: true,
                title,
                summaryDescription: description,
                fileChanges,
                commitOutput: out.out
            };
        } catch(err) {
            return new Error.Log(err).append('services.GitHubAPI.RepoManager.commiting');
        }
    }

    async fetch() {
        try {
            const fetched = await this.prompt.exec('git fetch');
            
            if (fetched instanceof Error.Log) {
                throw fetched;
            }

            if (fetched.success) {
                this.toolsCLI.printTemplate(fetched.out);
                return fetched;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async push(params) {
        try {
            const branchName = this.getCurrentBranch();
            const pushed = await this.prompt.exec(`git push --set-upstream origin ${branchName}${this.prompt.strigifyParams(params)}`);

            if (pushed instanceof Error.Log) {
                this.toolsCLI.printError(pushed);
                return pushed;
            }

            if (pushed.success) {
                this.toolsCLI.printTemplate(pushed.out);
                return pushed;
            } else {
                return this.toolsCLI.printError(new Error.Log(pushed).append({
                    name: 'PUSHING-CHANGES',
                    message: `Something went wrong with the changes push!`
                }));
            }
        } catch (err) {
            return new Error.Log(err).append('services.GitHubAPI.RepoManager.pushing');
        }
    }

    async pull() {
        try {
            const pulled = await this.prompt.exec('git pull');

            if (pulled instanceof Error.Log) {
                this.toolsCLI.printError(pulled);
                return pulled;
            }

            if (pulled.success) {
                this.toolsCLI.printTemplate(pulled.out);
                return pulled;
            } else {
                return this.toolsCLI.printError(new Error.Log(pulled).append({
                    name: 'PULLING-BRANCH',
                    message: `Something went wrong with the branch pull!`
                }));
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async compareBranches(base, head) {
        try {
            if (!base) {
                throw new Error.Log({
                    name: 'COMPARE-BRANCH',
                    message: `Error caught when it's comparing the branches`
                });
            }

            if (!head) {
                head = this.getCurrentBranch();
            }

            const compared = await this.ajax(`/repos/${this.repoPath}/compare/${base}...${head}`);
            if (compared instanceof Error.Log) {
                throw compared;
            }

            return new Compare(compared);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createPullRequest(data, options) {
        const { logsCB } = Object(options);

        if (typeof logsCB !== 'function') {
            logsCB = () => {};
        }

        try {
            logsCB(`Creating pull request on remote for repo "${this.repoPath}"...`);
            const PR = await this.ajax(
                `/repos/${this.repoPath}/pulls`,
                data,
                {method: 'POST'}
            );

            if (PR instanceof Error.Log) {
                throw PR;
            }

            // Adding assignees to PR
            logsCB(`Adding assignees to pull request on remote for repo "${this.repoPath}"...`);
            const addAssignees = await this.ajax(`/repos/${this.repoPath}/issues/${PR.number}/assignees`, {
                assignees: data.assignees
            }, {method: 'POST'});

            if (addAssignees instanceof Error.Log) {
                throw addAssignees;
            }

            // // Adding reviewers to PR
            logsCB(`Adding reviewers to pull request on remote for repo "${this.repoPath}"...`);
            if (Array.isArray(data.reviewers) && data.reviewers.length) {
                const addReviewers = await this.ajax(`/repos/${this.repoPath}/pulls/${PR.number}/requested_reviewers`, {
                    reviewers: data.reviewers.map(item => item.gitHubUser)
                }, {method: 'POST'});

                if (addReviewers instanceof Error.Log) {
                    throw addReviewers;
                }
            }

            // Adding labels to PR
            logsCB(`Adding labels to pull request on remote for repo "${this.repoPath}"...`);
            if (Array.isArray(data.labels) && data.labels.length) {
                const addLabels = await this.ajax(`/repos/${this.repoPath}/issues/${PR.number}/labels`, {
                    labels: data.labels.map(item => item.name)
                }, {method: 'POST'});

                if (addLabels instanceof Error.Log) {
                    throw addLabels;
                }
            }

            return PR;
        } catch (err) {
            return new Error.Log(err).append('services.GitHubAPI.RepoManager.creating_pull_request');
        }
    }
}

module.exports = RepoManager;
