const _Global = require('../maps/_Global');
const RepoManager = require('../../services/GitHubAPI/RepoManager');
const FS = require('../../services/FS');

class Repo extends _Global {
    constructor(setup = {
        ...Repo.prototype,
        nodeVersion: '',
        baseBranch: '',
        url: '',
        localPath: '',
        collaborators: [Object],
        projects: [Object],
        owner: Object,
        repoManager: RepoManager.prototype
    }, parentTask){
        super({...setup, validationRules: 'repos'}, setup);
        if (isObjectID(setup)) return;

        const User = require('./User');
        const Project = require('./Project');

        try {
            const { nodeVersion, baseBranch, url, repoName, repoPath, localPath, owner, collaborators, organization, projects } = setup || {};

            this.nodeVersion = nodeVersion;
            this.baseBranch = baseBranch;
            this.url = url;
            this.localPath = localPath;
            this.collaborators = Array.isArray(collaborators) ? collaborators.map(collab => new User(collab)) : [];
            this.projects = Array.isArray(projects) ? projects.map(project => new Project(project)) : [];
            this.owner = owner ? new User(owner) : {};

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
            this.repoManager = new RepoManager({
                localPath: this.localPath,
                repoName: this.repoName,
                repoPath: this.repoPath,
                organization: this.organization
            }, this);

            this.placeDefault();
            this._parentTask = () => parentTask;
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Repo');
        }
    }

    get parentTask() {
        return this._parentTask();
    }

    getProjectTemplate(templateName) {
        const task = this.parentTask;
        const project = task && task.project;
        const template = project && project.getTemplate(templateName);

        return template;
    }

    getTaskCod() {
        const task = this.parentTask;
        return task && task.taskID;
    }

    getTicketCod() {
        const task = this.parentTask;
        const ticket = task && task.ticket;
        return ticket && ticket.ticketID;
    }

    buildBranchBackupPath(currentBranch) {
        const date = new Date();
        const repo = this.cod;
        const ticket = this.getTicketCod();
        const branch = currentBranch;
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();

        return `temp/${repo}/${ticket}/${branch}/${year}-${month}-${day}__${hour}_${minute}`;
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

            await FS.copyFiles(filesToCopy, this.localPath, destDir);
            return current;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createFinalBranch() {
        try {
            const task = this.parentTask;
            const project = task && task.project;
            
            if (project) {
                const branchTemplate = project.getTemplate('branchName');
                const template = await branchTemplate();
                const branchName = await template.toMarkdown({taskBranch: task.taskBranch});
                const newBranch = await this.repoManager.createBranch(branchName, this.baseBranch, {bringChanges: true});

                if (newBranch instanceof Error.Log) {
                    throw newBranch;
                }
    
                return newBranch;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async commitChanges() {
        try {
            const isValidBranch = this.isCurrentBranchValid();
            const task = this.parentTask;
            const titleTemplate = await this.getProjectTemplate('prTitle')();
            const title = await titleTemplate.renderToString({taskID: task.taskID, taskTitle: task.taskName});

            if (isValidBranch) {
                const commit = await this.repoManager.commit(title, '');
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

    async buildPR() {
        try {
            const user = await this.getCurrentUser();
            const task = this.parentTask;
            const ticket = task && task.ticket;

            if (task) {
                const compared = await this.repoManager.compareBranches(this.baseBranch);

                const objData = {
                    taskID: task.taskID,
                    taskURL: task.taskURL,
                    ticketURL: ticket.ticketURL,
                    isNew: true,
                    assignedUsers: [user._id],
                    summary: task.description,
                    owner: user._id,
                    fileChanges: compared.files,
                    task: task._id,
                    ticket: ticket._id,
                    base: this.parentTask.project.baseBranch || this.baseBranch,
                    head: this.parentTask.taskBranch,
                    labels: []
                };
                
                const prTitleTemplate = await this.getProjectTemplate('prTitle')();
                const description = await this.getProjectTemplate('prDescription')();

                objData.name = await prTitleTemplate.renderToString({taskID: task.taskID, taskTitle: task.taskName});
                objData.description = await description.renderToString(objData);

                return objData;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Repo;
