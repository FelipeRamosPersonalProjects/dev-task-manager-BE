const _Global = require('../maps/_Global');

class Task extends _Global {
    constructor(setup, parentTicket){
        if (!setup || isObjectID(setup) || !setup) return;
        super({...setup, validationRules: 'tasks'});

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
                isVersionedTask,
                taskVersion,
                isCurrentVersion,
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
            this.isVersionedTask = isVersionedTask;
            this.taskVersion = taskVersion;
            this.isCurrentVersion = isCurrentVersion;
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

            this.PullRequestModel = PullRequest;
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

    get ticketURL() {
        return this.ticket && this.ticket.ticketURL;
    }

    get taskBranch() {
        return this.getTaskBranch();
    }

    get nextBranchVersion() {
        const result = this.currentVersion + 1;
        return !isNaN(result) && Number(result);
    }

    get nextBranchName() {
        return this.getTaskBranch(this.nextBranchVersion);
    }

    getTaskBranch(version) {
        try {
            const prCount = this.pullRequests.length + 1;
            let versionCount = ((prCount > this.currentVersion) || !this.currentVersion) ? prCount : this.currentVersion;

            if (version) {
                versionCount = version;
            }

            if (this.taskID) {
                if (this.pullRequests.length || versionCount > 1) {
                    return `feature/${this.taskID}-v${versionCount}`;
                } else {
                    return `feature/${this.taskID}`;
                }
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

    async savePR() {
        try {
            const builded = await this.repo.buildPR();
            if (builded instanceof Error.Log) {
                throw builded;
            }
            
            const saved = await this.PullRequestModel.save(builded);
            if (saved instanceof Error.Log) {
                throw saved;
            }
            
            saved.task = this;
            return saved;
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

    async increaseCurrentVersion() {
        try {
            if (this.isComplete && !this.currentVersion) {
                const created = await this.updateDB({collectionName: 'tasks', data: { currentVersion: this.pullRequests.length + 1 }})
                if (created instanceof Error.Log) {
                    throw created;
                }

                return created;
            }

            const increased = await this.increaseProp('currentVersion');
            if (increased instanceof Error.Log) {
                throw increased;
            }

            return increased;
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Task;
