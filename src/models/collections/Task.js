const _Global = require('../maps/_Global');
const DiscoveryModel = require('@models/tasks/Discovery');
const DevelopmentModel = require('@models/tasks/Development');
const TODOReminder = require('@models/tasks/TODOReminder');
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
                status,
                frontURL,
                taskType,
                isInternal,
                source,
                prStage,
                jiraIssue,
                taskVersion,
                taskName,
                externalKey,
                externalURL,
                description,
                parentTask,
                subTasks,
                project,
                ticket,
                dueDate,
                sharedWith,
                pullRequests,
                comments,
                repo,
                discoveries,
                developments,
                validations,
                todoReminders,
                assignedUsers
            } = new Object(setup);

            this.collectionName = 'tasks';
            this.status = status;
            this.frontURL = frontURL;
            this.taskType = taskType;
            this.isInternal = isInternal;
            this.source = source;
            this.prStage = prStage;
            this.jiraIssue = jiraIssue;
            this.taskVersion = taskVersion;
            this.taskName = taskName;
            this.externalKey = externalKey;
            this.externalURL = externalURL;
            this.description = description;
            this.dueDate = dueDate;
            this.parentTask = isCompleteDoc(parentTask) ? new Task(parentTask) : {};
            this.subTasks = isCompleteDoc(subTasks) ? subTasks.map(sub => new Task(sub)) : [];
            this.ticket = isCompleteDoc(ticket) ? new Ticket(ticket) : {};
            this.sharedWith = isCompleteDoc(sharedWith) ? new User(sharedWith) : {};
            this.pullRequests = isCompleteDoc(pullRequests) ? pullRequests.map(pullRequest => new PullRequest(pullRequest)) : [];
            this.comments = isCompleteDoc(comments) ? comments.map(comment => new Comment(comment)) : [];
            this.project = isCompleteDoc(project) ? new Project(project) : {};
            this.repo = isCompleteDoc(repo) ? new Repo(repo, this) : {};
            this.assignedUsers = Array.isArray(assignedUsers) && !assignedUsers.oid() ? assignedUsers.map(item => new User(item)) : [];

            this.displayName = `[${this.getSafe('ticket.externalKey') || this.cod}] ${this.taskName}`;

            if (this.taskType === 'INVESTIGATION') {
                this.jiraIssueType = '10051';
                this.discoveries = discoveries && new DiscoveryModel(discoveries);
            }

            else if (this.taskType === 'DEVELOPMENT') {
                this.jiraIssueType = '10052';
                this.developments = developments && new DevelopmentModel(developments);
            }

            else if (this.taskType === 'TODO') {
                this.jiraIssueType = '10060';
                this.todoReminders = todoReminders && new TODOReminder(todoReminders);
            }

            this.placeDefault();
            this.parentTicket = () => parentTicket;
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Task');
        }
    }

    get repoManager() {
        return (typeof this.repo === 'object') && this.repo.repoManager;
    }

    get spaceJiraProject() {
        return this.getSafe('ticket.space.jiraProject');
    }

    get externalTicketKey() {
        return this.ticket && this.ticket.externalKey;
    }

    get ticketUID() {
        return this.ticket && this.ticket._id;
    }

    get ticketJIRA() {
        return this.getSafe('ticket.jiraIssue');
    }

    get externalTicketURL() {
        return this.ticket && this.ticket.externalURL;
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
            return pull.isCurrentVersion && pull.status !== 'CLOSED';
        });

        return currentPR;
    }

    getTaskBranch(customVersion) {
        try {
            const version = customVersion || (this.taskVersion ? this.taskVersion : 1);

            if (!this.externalKey) {
                throw new Error.Log('common.missing_params', 'Task.externalKey', 'Task.taskBranch', 'Task.js');
            }

            if (version > 1) {
                return `feature/${this.externalKey}-v${version}`;
            } else {
                return `feature/${this.externalKey}`;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async jiraCreateTask() {
        try {
            for (let user of this.assignedUsers) {
                if (!user || !user.jiraConnect) return;

                const jiraCreated = await user.jiraConnect.createIssue({
                    parentKey: this.ticketJIRA && this.ticketJIRA.id,
                    issueType: this.jiraIssueType,
                    externalKey: this.externalTicketKey,
                    projectKey: this.spaceJiraProject,
                    title: this.displayName,
                    description: this.description
                });

                await this.updateDB({ data: { jiraIssue: jiraCreated.data }});
                return jiraCreated;
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async jiraUpdate(data) {
        try {
            for (let user of this.assignedUsers) {
                const jiraUpdated = await user.jiraConnect.updateIssue(this.jiraIssue.key, data);

                if (jiraUpdated instanceof Error.Log) {
                    throw jiraUpdated
                }

                return jiraUpdated;
            };
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
            const isExistentPR = this.pullRequests.find(pr => [
                (pr.isCurrentVersion === true),
                (pr.status !== 'CLOSED')
            ].every(item => item));
            const user = await this.getCurrentUser();

            if (isExistentPR) {
                const populatedLoad = await isExistentPR.loadDB();
                return populatedLoad;
            } else {
                const prTitleTemplate = this.repo.getProjectTemplate('prTitle');
                const prName = prTitleTemplate.renderToString({externalKey: this.externalKey, taskTitle: this.taskName});

                const currentUser = await this.getCurrentUser();
                const newDocPR = await CRUD.create('pull_requests', {
                    version: this.nextBranchVersion,
                    name: prName,
                    base: this.repo.baseBranch,
                    head: this.nextBranchName,
                    owner: currentUser && currentUser._id,
                    repo: this.repo._id,
                    task: this._id,
                    ticket: this.ticketUID,
                    externalKey: this.externalKey,
                    externalURL: this.externalURL,
                    externalURL: this.externalURL,
                    assignedUsers: user._id,
                    summary: this.description
                });

                if (newDocPR instanceof Error.Log) {
                    throw newDocPR;
                }

                const initialized = await newDocPR.initialize().loadDB();

                initialized.isNewPR = true;
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
                newBranch = await this.repo.createFinalBranch(backup.backupFolder);

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

    static async createTask(data) {
        try {
            const created = await CRUD.create('tasks', data);
            if (created instanceof Error.Log) {
                throw created;
            }

            return created;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Task;
