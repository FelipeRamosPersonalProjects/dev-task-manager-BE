const _Global = require('../maps/_Global');

class Task extends _Global {
    constructor(setup = {
        ...this,
        taskName: '',
        taskCod: '',
        description: '',
        dueDate: '',
        project: Project.prototype,
        assignedUser: User.prototype,
        ticket: [Ticket.prototype],
        sharedWith: User.prototype,
        pullRequests: [PullRequest.prototype],
        comments: [Comment.prototype]
    }){
        super({...setup, validationRules: 'tasks'});
        if (!setup.isComplete && !setup.isNew) return;

        const Ticket = require('./Ticket');
        const User = require('./User');
        const PullRequest = require('./PullRequest');
        const Comment = require('./Comment');
        const Project = require('./Project');

        try {
            const { taskName, taskCod, description, project, assignedUser, ticket, dueDate, sharedWith, pullRequests, comments } = setup || {};

            this.taskName = taskName;
            this.taskCod = taskCod;
            this.displayName = taskName;
            this.description = description;
            this.dueDate = dueDate;
            this.assignedUser = assignedUser ? new User(assignedUser) : {};
            this.ticket = ticket ? new Ticket(ticket) : [];
            this.sharedWith = sharedWith ? new User(sharedWith) : {};
            this.pullRequests = Array.isArray(pullRequests) ? pullRequests.map(pullRequest => new Ticket(pullRequest)) : [];
            this.comments = Array.isArray(comments) ? comments.map(comment => new Ticket(comment)) : [];
            this.project = project ? new Project(project) : {};

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Task');
        }
    }
}

module.exports = Task;
