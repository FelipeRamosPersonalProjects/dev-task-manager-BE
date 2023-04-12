const _Global = require('../maps/_Global');

class Task extends _Global {
    constructor(setup = {
        ..._Global.prototype,
        source,
        taskName: '',
        taskID: '',
        description: '',
        dueDate: '',
        project: Object,
        assignedUser: Object,
        ticket: [Object],
        sharedWith: Object,
        pullRequests: [Object],
        comments: [Object],
        repo: Object
    }, parentTicket){
        super({...setup, validationRules: 'tasks'});
        if (isObjectID(setup)) return;

        const Ticket = require('./Ticket');
        const User = require('./User');
        const PullRequest = require('./PullRequest');
        const Comment = require('./Comment');
        const Project = require('./Project');
        const Repo = require('./Repo');

        try {
            const {
                source,
                taskBranch,
                taskName,
                taskID,
                taskURL,
                description,
                project,
                assignedUser,
                ticket,
                dueDate,
                sharedWith,
                pullRequests,
                comments,
                repo
            } = setup || {};

            this.source = source;
            this.taskName = taskName;
            this.taskID = taskID;
            this.taskURL = taskURL;
            this.taskBranch = taskBranch;
            this.description = description;
            this.dueDate = dueDate;
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
}

module.exports = Task;
