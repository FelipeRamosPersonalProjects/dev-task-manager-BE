const _Global = require('../maps/_Global');
const CRUD = require('@CRUD');

class Task extends _Global {
    constructor(setup, parentTicket){
        super({...setup, validationRules: 'tasks'});
        if (!setup || isObjectID(setup) || !setup) return;

        const Ticket = require('./Ticket');
        const User = require('./User');
        const PullRequest = require('./PullRequest');
        const Comment = require('./Comment');
        const Project = require('./Project');
        const Repo = require('./Repo');

        try {
            const {
                taskType,
                isInternal,
                source,
                prStage,
                taskVersion,
                taskName,
                taskID,
                taskURL,
                description,
                parentTask,
                subTasks,
                project,
                assignedUser,
                ticket,
                dueDate,
                sharedWith,
                pullRequests,
                comments,
                repo
            } = new Object(setup || {});

            this.collectionName = 'tasks';
            this.taskType = taskType;
            this.isInternal = isInternal;
            this.source = source;
            this.prStage = prStage;
            this.taskVersion = taskVersion;
            this.taskName = taskName;
            this.taskID = taskID;
            this.taskURL = taskURL;
            this.description = description;
            this.dueDate = dueDate;
            this.parentTask = !isObjectID(parentTask) ? new Task(parentTask) : {};
            this.subTasks = !isObjectID(subTasks) ? subTasks.map(sub => new Task(sub)) : [];
            this.assignedUser = !isObjectID(assignedUser) ? new User(assignedUser) : {};
            this.ticket = !isObjectID(ticket) ? new Ticket(ticket) : {};
            this.sharedWith = !isObjectID(sharedWith) ? new User(sharedWith) : {};
            this.pullRequests = !isObjectID(pullRequests) ? pullRequests.map(pullRequest => new PullRequest(pullRequest)) : [];
            this.comments = !isObjectID(comments) ? comments.map(comment => new Comment(comment)) : [];
            this.project = !isObjectID(project) ? new Project(project) : {};
            this.repo = !isObjectID(repo) ? new Repo(repo, this) : {};
            
            this.placeDefault();
            this.parentTicket = () => parentTicket
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Task');
        }
    }

    get displayName() {
        return this.taskName;
    }

    get repoManager() {
        return (typeof this.repo === 'object') && this.repo.repoManager;
    }

    get ticketID() {
        return this.ticket && this.ticket.ticketID;
    }

    get ticketUID() {
        return this.ticket && this.ticket._id;
    }

    get ticketURL() {
        return this.ticket && this.ticket.ticketURL;
    }

    get taskBranch() {
        return this.getTaskBranch();
    }

    get nextBranchVersion() {
        const newer = this.newerVersion;
        const result = newer ? newer.version + 1 : 1;
        return !isNaN(result) && Number(result);
    }

    get nextBranchName() {
        return this.getTaskBranch(this.nextBranchVersion);
    }

    get newerVersion() {
        const sorted = this.prInProgress.sort((a, b) => b.version - a.version);
        const higher = sorted.length ? sorted[0] : null;

        return higher;
    }

    get prInProgress() {
        const currentPR = this.pullRequests && this.pullRequests.filter(pull => {
            return pull.isCurrentVersion && pull.prStage !== 'published';
        });

        return currentPR;
    }

    getTaskBranch(customVersion) {
        try {
            const version = customVersion || (this.taskVersion ? this.taskVersion : 1);

            if (!this.taskID) {
                throw new Error.Log('common.missing_params', 'Task.taskID', 'Task.taskBranch', 'Task.js');
            }

            if (version > 1) {
                return `feature/${this.taskID}-v${version}`;
            } else {
                return `feature/${this.taskID}`;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createPR () {
        try {
            const isReadyToCommit = await this.prepareBranchToPR();

            if (isReadyToCommit) {
                const isReadyToPR = await this.repo.commitChanges();
                if (isReadyToPR instanceof Error.Log) {
                    throw isReadyToPR;
                }

                const savingPR = await this.savePR();
                if (savingPR instanceof Error.Log) {
                    throw savingPR;
                }

                const publish = await savingPR.publishPR();
                if (publish instanceof Error.Log) {
                    throw publish;
                }

                await savingPR.updateDB({data: { gitHubPR: publish }});
                return publish;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async savePR(pullRequest) {
        try {
            const filled = await this.repo.fillPR();
            if (filled instanceof Error.Log) {
                throw filled;
            }
            
            const updated = await pullRequest.updateDB({ collectionName: 'pull_requests', data: filled });
            if (updated instanceof Error.Log) {
                throw updated;
            }
            
            updated.task = this;
            updated.fileChanges = filled.fileChanges;
            return updated;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async dbInitDocPR() {
        try {
            const isExistentPR = this.pullRequests.find(pr => pr.isCurrentVersion === true && pr.prStage !== 'published');
            const user = await this.getCurrentUser();
            
            if (isExistentPR) {
                const populatedLoad = await isExistentPR.loadDB();
                return populatedLoad;
            } else {
                const prTitleTemplate = this.repo.getProjectTemplate('prTitle');
                const prName = prTitleTemplate.renderToString({taskID: this.taskID, taskTitle: this.taskName});
                
                const currentUser = await this.getCurrentUser();
                const newDocPR = await CRUD.create('pull_requests', {
                    version: this.nextBranchVersion,
                    name: prName,
                    base: this.repo.baseBranch,
                    head: this.taskBranch,
                    owner: currentUser && currentUser._id,
                    repo: this.repo._id,
                    task: this._id,
                    ticket: this.ticketUID,
                    taskID: this.taskID,
                    taskURL: this.taskURL,
                    ticketURL: this.ticketURL,
                    assignedUsers: user._id,
                    summary: this.description
                });

                if (newDocPR instanceof Error.Log) {
                    throw newDocPR;
                }

                const initialized = await newDocPR.initialize().loadDB();
                this.pullRequests.push(initialized);
                return initialized;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async prepareBranchToPR() {
        let newBranch;

        try {
            const backup = await this.repo.createBranchBackup();
            if (backup instanceof Error.Log) {
                throw backup;
            }

            const isValidBranch = this.repo.isCurrentBranchValid();
            if (!isValidBranch) {
                newBranch = await this.repo.createFinalBranch();

                if (newBranch instanceof Error.Log) {
                    throw newBranch;
                }
            }

            return {
                success: true,
                newBranch: newBranch,
                isReady: true
            }
        } catch (err) {
            if (err.name === 'GitHubAPIRepoManagerBranchIsExist') {
                return err;
            }

            throw new Error.Log(err);
        }
    }

    async increaseVersion() {
        try {
            const increased = await this.increaseProp('taskVersion');
            if (increased instanceof Error.Log) {
                throw increased;
            }

            this.taskVersion = increased.taskVersion;
            return increased;
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Task;
