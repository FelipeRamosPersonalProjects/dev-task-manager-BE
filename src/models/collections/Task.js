const _Global = require('../maps/_Global');
const Project = require('./Project');
const Ticket = require('./Ticket');
const User = require('./User');
const PullRequest = require('./PullRequest');
const Comment = require('./Comment');

class Task extends _Global {
    constructor(setup = {
        ...this,
        taskName: '',
        taskCod: '',
        description: '',
        dueDate: '',
        project: Project.prototype,
        assignedUser: User.prototype,
        tickets: [Ticket.prototype],
        sharedWith: User.prototype,
        pullRequests: [PullRequest.prototype],
        comments: [Comment.prototype]
    }){
        try {
            super({...setup, validationRules: 'tasks'});
            const { taskName, taskCod, description, project, assignedUser, tickets, dueDate, sharedWith, pullRequests, comments } = setup || {};

            this.taskName = taskName;
            this.taskCod = taskCod;
            this.displayName = taskName;
            this.description = description;
            this.dueDate = dueDate;
            this.project = project && new Project(project);
            this.assignedUser = assignedUser && new User(assignedUser);
            this.tickets = Array.isArray(tickets) && tickets.map(ticket => new Ticket(ticket));
            this.sharedWith = sharedWith && new User(sharedWith);
            this.pullRequests = Array.isArray(pullRequests) && pullRequests.map(pullRequest => new Ticket(pullRequest));
            this.comments = Array.isArray(comments) && comments.map(comment => new Ticket(comment));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Task');
        }
    }
}

module.exports = Task;
