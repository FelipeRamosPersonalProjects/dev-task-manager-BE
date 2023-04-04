const _Global = require('../maps/_Global');
const User = require('./User');
const Comment = require('./Comment');
const Ticket = require('./Ticket');
const Task = require('./Task');

class PullRequests extends _Global {
    constructor(setup = {
        owner: User.prototype,
        name: '',
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
        if (!setup.isComplete) return;
        const { name, remoteID, summary, description, fileChanges, assignedUsers, reviewers, labels, bmConfigs, comments } = setup || {};

        try {
            this.owner = owner && new User(owner);
            this.name = name;
            this.remoteID = remoteID;
            this.summary = summary;
            this.description = description;
            this.fileChanges = fileChanges;
            this.assignedUsers = Array.isArray(assignedUsers) && assignedUsers.map(user => User(user));
            this.reviewers = Array.isArray(reviewers) && reviewers.map(user => User(user));
            this.labels = labels;
            this.bmConfigs = bmConfigs;
            this.comments = Array.isArray(comments) && comments.map(comment => Comment(comment));
            this.ticket = ticket && new Ticket(ticket);
            this.task = task && new Task(task);

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'PullRequests');
        }
    }
}

module.exports = PullRequests;
