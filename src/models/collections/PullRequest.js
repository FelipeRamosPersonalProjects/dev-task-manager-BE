const _Global = require('../maps/_Global');
const User = require('./User');
const Comment = require('./Comment');
const Ticket = require('./Ticket');
const Task = require('./Task');
const FileChange = require('../../services/GitHubAPI/FileChange');
const CRUD = require('../../services/database/crud');

class PullRequest extends _Global {
    constructor(setup = {
        ..._Global.prototype,
        owner: User.prototype,
        name: '',
        head: '',
        base: '',
        remoteID: '',
        summary: '',
        description: '',
        fileChanges: [],
        assignedUsers: [User.prototype],
        reviewers: [User.prototype],
        labels: [],
        bmConfigs: [],
        comments: [Comment.prototype],
        ticket: Ticket.prototype,
        task: Task.prototype
    }){
        super({...setup, validationRules: 'pull_requests'});
        if (isObjectID(setup)) return;
        const { owner, name, head, base, remoteID, summary, description, fileChanges, assignedUsers, reviewers, labels, bmConfigs, comments, ticket, task } = setup || {};
        
        try {
            this.owner = owner._bsontype !== 'ObjectID' ? new User(owner) : {};
            this.name = name;
            this.remoteID = remoteID;
            this.summary = summary;
            this.head = head;
            this.base = base;
            this.fileChanges = !isObjectID(fileChanges) && fileChanges.map(change => new FileChange(change));
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
                this.description = description.toMarkdown({
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

    get repoManager() {
        return this.repo && this.repo.repoManager;
    }

    get repo() {
        return this.task && this.task.repo;
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
            
            return published;
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
