const _Global = require('../maps/_Global');
const RepoManager = require('../../services/GitHubAPI/RepoManager');
const FS = require('../../services/FS');
const config = require('@config');

class Repo extends _Global {
    constructor(setup, parentTask){
        super({...setup, validationRules: 'repos'}, setup);
        if (!setup || isObjectID(setup)) return;

        const User = require('./User');
        const Project = require('./Project');
        const PullRequest = require('./PullRequest');

        try {
            const {
                nodeVersion,
                baseBranch,
                url,
                repoName,
                repoPath,
                localPath,
                owner,
                collaborators,
                organization,
                projects,
                pullRequest
            } = new Object(setup || {});

            this.nodeVersion = nodeVersion;
            this.baseBranch = baseBranch;
            this.url = url;
            this.localPath = localPath;
            this.collaborators = !isObjectID(collaborators) && Array.isArray(collaborators) ? collaborators.map(collab => new User(collab)) : [];
            this.projects = !isObjectID(projects) && Array.isArray(projects) ? projects.map(project => new Project(project)) : [];
            this.owner = !isObjectID(owner) ? new User(owner) : {};
            this.pullRequest = !isObjectID(pullRequest) ? new PullRequest(pullRequest) : {};

            if (url) {
                const separateHost = url.split('https://github.com/');
                const repoPathArray = separateHost[1] && separateHost[1].split('/');

                if (repoPathArray.length < 2) return;

                this.organization = repoPathArray[0];
                this.repoName = repoPathArray[1];
                this.repoPath = [repoPathArray[0], repoPathArray[1]].join('/');
            } else {
                this.organization = organization;
                this.repoName = repoName;
                this.repoPath = repoPath;
            }

            this._parentTask = () => parentTask;
            this.displayName = this.repoPath;
            this.repoManager = new RepoManager({
                localPath: this.localPath,
                repoName: this.repoName,
                repoPath: this.repoPath,
                organization: this.organization
            }, this);

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Repo');
        }
    }

    get parentTask() {
        return this._parentTask();
    }

    get taskID() {
        const task = this.parentTask;
        return task && task.taskID;
    }

    get ticketID() {
        const task = this.parentTask;
        const ticket = task && task.ticket;
        return ticket && ticket.ticketID;
    }

    getProjectTemplate(templateName) {
        const task = this.parentTask;
        const project = task && task.project;
        const template = project && project.getTemplate(templateName);

        return template;
    }

    buildBranchBackupPath(currentBranch) {
        const date = new Date();
        const repo = this.repoPath;
        const ticket = this.ticketID;
        const branch = currentBranch;
        const headBranch = this.parentTask && this.parentTask.taskBranch;
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const mode = config.mode === 'production' ? 'PROD' : 'DEV';

        return `${config.backupFolder}/${mode}/${repo}/${ticket}/${branch}__${headBranch}/${year}-${month}-${day}__${hour}-${minute}`;
    }

    isCurrentBranchValid() {
        const task = this.parentTask || {};

        try {
            const currentBranch = this.repoManager.getCurrentBranch();
            const {parent, path} = this.parseBranchName(currentBranch) || {};

            const isParentValid = [
                (parent === 'develop'),
                (parent === 'feature'),
                (parent === 'release'),
                (parent === 'bugfix'),
                (parent === this.baseBranch)
            ].some(item => item);
    
            if (!isParentValid) {
                throw new Error.Log({
                    name: 'RepoParseBranchName',
                    message: `The parent branch is not valid, it should be: 'develop', 'feature', 'release' or 'bugfix'!\nBut received "${parent}".`
                });
            }
    
            if (path.length > 1) {
                const match = path.find(item => item.match(task.taskID));
    
                if (match) {
                    return true;
                }
            }
    
            return false;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    parseBranchName(name) {
        if (typeof name !== 'string') return {};

        const splitted = name.split('/');
        const parent = splitted.length && splitted[0];

        return {
            parent,
            path: splitted,
            branch: splitted.length > 1 ? splitted[1] : ''
        }
    }

    async createBranchBackup() {
        try {
            const currentBranch = this.repoManager.getCurrentBranch();
            const current = await this.repoManager.currentChanges();

            if (currentBranch instanceof Error.Log) {
                throw currentBranch;
            }
            if (current instanceof Error.Log) {
                throw current;
            }

            const filesToCopy = current.success && current.changes || [];
            const destDir = this.buildBranchBackupPath(currentBranch);
            const files = await FS.copyFiles(filesToCopy, this.localPath, destDir);

            return {
                success: true,
                backupFolder: destDir,
                currentChanges: current,
                copiesResponse: files
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createFinalBranch(backupFolder) {
        try {
            const task = this.parentTask;
            const project = task && task.project;
            
            if (project) {
                const template = project.getTemplate('branchName');
                const branchName = template.toMarkdown({taskBranch: task.taskBranch});
                const newBranch = await this.repoManager.createBranch(branchName, this.baseBranch, {bringChanges: true, backupFolder});

                if (newBranch instanceof Error.Log) {
                    throw newBranch;
                }
    
                return newBranch;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async commitChanges(fileChanges, summary) {
        try {
            const isValidBranch = this.isCurrentBranchValid();
            const task = this.parentTask;
            const titleTemplate = this.getProjectTemplate('prTitle');
            const title = titleTemplate.renderToString({taskID: task.taskID, taskTitle: task.taskName});

            if (isValidBranch) {
                const commit = await this.repoManager.commit(title, summary || task.description, {fileChanges});
                if (commit instanceof Error.Log) {
                    throw commit;
                }

                toolsCLI.print(commit.out);
                const push = await this.repoManager.push();
                if (push instanceof Error.Log) {
                    throw push;
                }

                toolsCLI.print(push.out);
                return {
                    success: true,
                    commit: commit.out,
                    push: push.out
                }
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async fillPR() {
        try {
            const task = this.parentTask;
            const prInProgress = task && task.prInProgress;
            const descrTemplate = this.getProjectTemplate('prDescription');

            if (prInProgress.length) {
                const compared = await this.repoManager.compareBranches(this.baseBranch, task.taskBranch);
                if (compared instanceof Error.Log) {
                    toolsCLI.printError(compared);
                    return compared;
                }
                
                const description = descrTemplate.renderToString({
                    ...prInProgress[0],
                    fileChanges: compared.files
                });

                return {
                    description,
                    fileChanges: compared.files
                };
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Repo;
