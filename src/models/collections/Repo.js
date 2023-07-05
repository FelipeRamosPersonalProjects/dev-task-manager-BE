const _Global = require('../maps/_Global');
const RepoManager = require('@services/GitHubAPI/RepoManager');
const BackupService = require('@services/Backup');

class Repo extends _Global {
    constructor(setup, parentTask){
        super({...setup, validationRules: 'repos'}, parentTask);
        if (!setup || isObjectID(setup)) return;

        const User = require('./User');
        const Project = require('./Project');
        const PullRequest = require('./PullRequest');

        try {
            const {
                displayName,
                frontURL,
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
                pullRequests
            } = Object(setup);

            this._parentTask = () => parentTask;
            this.backup = new BackupService();

            this.displayName = displayName;
            this.frontURL = frontURL;
            this.nodeVersion = nodeVersion;
            this.baseBranch = baseBranch;
            this.url = url;
            this.localPath = localPath;
            this.collaborators = isCompleteDoc(collaborators) ? collaborators.map(collab => new User(collab)) : [];
            this.projects = isCompleteDoc(projects) ? projects.map(project => new Project(project)) : [];
            this.owner = isCompleteDoc(owner) ? new User(owner) : {};
            this.pullRequests = isCompleteDoc(pullRequests) ? pullRequests.map(pr => new PullRequest(pr)) : [];

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

            this.displayName = this.repoPath;
            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Repo');
        }
    }

    get parentTask() {
        return this._parentTask();
    }

    get externalKey() {
        const task = this.parentTask;
        return task && task.externalKey;
    }

    get externalKey() {
        const task = this.parentTask;
        const ticket = task && task.ticket;
        return ticket && ticket.externalKey;
    }

    get repoManager() {
        return new RepoManager({
            localPath: this.localPath,
            repoName: this.repoName,
            repoPath: this.repoPath,
            organization: this.organization
        }, this);
    }

    getProjectTemplate(templateName) {
        const task = this.parentTask;
        const project = task && task.project;
        const template = project && project.getTemplate(templateName);

        return template;
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
                const match = path.find(item => item.match(task.externalKey));
    
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

    buildBranchBackupPath(currentBranch, title) {
        return this.backup && this.backup.buildBranchBackupPath(this, currentBranch, title);
    }

    async createBranchBackup(setup) {
        return this.backup && await this.backup.createBranchBackup(this, setup);
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
            const title = titleTemplate.renderToString({externalKey: task.externalKey, title: task.title});

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
