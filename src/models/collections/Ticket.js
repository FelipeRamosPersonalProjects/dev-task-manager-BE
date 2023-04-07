const _Global = require('../maps/_Global');

class Ticket extends _Global {
    constructor(setup = {
        ...this,
        ticketID: '',
        ticketURL: '',
        title: '',
        description: '',
        status: '',
        project: Project.prototype,
        sla: SLAModel.prototype,
        tasks: [Task.prototype],
        pullRequests: [PullRequest.prototype],
        assignedUsers: [User.prototype],
        comments: [Comment.prototype]
    }){
        super({...setup, validationRules: 'tickets'});
        const Project = require('./Project');
        const Task = require('./Task');
        const PullRequest = require('./PullRequest');
        const User = require('./User');
        const Comment = require('./Comment');
        const SLAModel = require('../maps/SLA');

        if (!setup.isComplete && !setup.isNew) return;
        const {ticketID, ticketURL, project, title, description, status, sla, tasks, pullRequests, assignedUsers, comments} = setup || {};

        try {
            this.ticketID = ticketID;
            this.ticketURL = ticketURL;
            this.title = title;
            this.displayName = `[${ticketID}] ${title}`;
            this.description = description;
            this.status = status;
            this.project = project && new Project(project);
            this.sla = sla && new SLAModel(sla);
            this.tasks = Array.isArray(tasks) && tasks.map(task => new Task(task));
            this.pullRequests = Array.isArray(pullRequests) && pullRequests.map(pr => new PullRequest(pr));
            this.assignedUsers = Array.isArray(assignedUsers) && assignedUsers.map(user => new User(user));
            this.comments = Array.isArray(comments) && comments.map(comment => new Comment(comment));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Ticket');
        }
    }
}

module.exports = Ticket;
