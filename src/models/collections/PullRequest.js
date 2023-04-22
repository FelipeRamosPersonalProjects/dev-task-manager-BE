const _Global = require('../maps/_Global');
const User = require('./User');
const Comment = require('./Comment');
const Ticket = require('./Ticket');
const Task = require('./Task');
const FileChange = require('@services/GitHubAPI/FileChange');
const CRUD = require('@CRUD');

class PullRequest extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'pull_requests'});
        if (!setup || isObjectID(setup)) return;

        const {
            owner,
            name,
            head,
            base,
            remoteID,
            prStage,
            isCurrentVersion,
            version,
            summary,
            description,
            fileChanges,
            assignedUsers,
            reviewers,
            labels,
            bmConfigs,
            comments,
            ticket,
            task,
            gitHubPR
        } = setup || {};
        
        try {
            this.collectionName = 'pull_requests';
            this.gitHubPR = gitHubPR;
            this.owner = owner._bsontype !== 'ObjectID' ? new User(owner) : {};
            this.name = name;
            this.remoteID = remoteID;
            this.prStage = prStage;
            this.isCurrentVersion = isCurrentVersion;
            this.version = version;
            this.summary = summary;
            this.head = head;
            this.base = base;
            this.fileChanges = !isObjectID(fileChanges) && fileChanges.map(change => new FileChange(change, this));
            this.assignedUsers = !isObjectID(assignedUsers) && assignedUsers.map(user => new User(user));
            this.reviewers = !isObjectID(reviewers) && reviewers.map(user => new User(user));
            this.labels = labels;
            this.bmConfigs = bmConfigs;
            this.comments = !isObjectID(comments) && comments.map(comment => Comment(comment));
            this.ticket = !isObjectID(ticket) ? new Ticket(ticket) : {};
            this.task = !isObjectID(task) ? new Task(task) : {};
            
            if (typeof description === 'string') {
                this.description = description;
            } else {
                this.description = description && description.toMarkdown({
                    ticketURL: ticket.ticketURL,
                    taskURL: task.taskURL,
                    summary: task.description,
                    fileChanges
                });
            }

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'PullRequests');
        }
    }

    get displayName() {
        return `[${this.cod}] ${this.name}`;
    }

    get repoManager() {
        return this.repo && this.repo.repoManager;
    }

    get repo() {
        return this.task && this.task.repo;
    }

    get parentTicket() {
        return this.ticket || this.task.ticket;
    }

    get taskID() {
        return this.task && this.task.taskID;
    }

    get ticketID() {
        return this.parentTicket && this.parentTicket.ticketID;
    }

    get project() {
        return this.task && this.task.project && this.task.project;
    }

    async updateDescription(dontSave) {
        const descriptionTemplate = this.project.getTemplate('prDescription');
        const newDescription = descriptionTemplate.renderToString({
            ticketURL: this.parentTicket.ticketURL,
            taskURL: this.task.taskURL,
            summary: this.summary,
            fileChanges: this.fileChanges
        });

        if (!dontSave) {
            const updatedDescription = await this.updateDB({ data: {
                description: newDescription
            }});
    
            if (updatedDescription instanceof Error.Log) {
                updatedDescription.consolePrint();
                throw updatedDescription;
            }
    
            this.description = newDescription;
            return this;
        } else {
            return newDescription;
        }
    }

    async saveRemoteData(published) {
        this.gitHubPR = published;

        try {
            const updatedRemote = await this.updateDB({data: { gitHubPR: published }});
            if (updatedRemote instanceof Error.Log) {
                updatedRemote.consolePrint();
                throw updatedRemote;
            }

            return this;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async changeStage(newStage) {
        if (!newStage) {
            throw new Error.Log('common.missing_params', 'newStage', 'PullRequest.changeStage', 'PullRequest.js');
        }

        try {
            const updated = await this.updateDB({data: { prStage: newStage, isCurrentVersion: !(newStage === 'aborted') }});
            if (updated instanceof Error.Log) {
                return updated;
            }

            this.prStage = newStage;
            return this;
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    async publishPR() {
        try {
            const published = await this.repoManager.createPullRequest({
                owner: this.repoManager.userName,
                repo: this.repo.repoName,
                title: this.name,
                body: this.description,
                head: this.head,
                base: this.base,
                labels: this.labels
            });

            if (published instanceof Error.Log) {
                published.consolePrint();
                throw published;
            }

            const updatedPR = await this.saveRemoteData(published);
            if (updatedPR instanceof Error.Log) {
                updatedPR.consolePrint();
                throw updatedPR;
            }

            return updatedPR;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async deletePR() {
        try {
            const deleted = await this.deleteDB();
            return deleted;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async save(data = PullRequest.prototype) {
        try {
            const saved = await CRUD.create('pull_requests', data || {});
            if (saved instanceof Error.Log) {
                throw saved;
            }

            return saved.initialize();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = PullRequest;
