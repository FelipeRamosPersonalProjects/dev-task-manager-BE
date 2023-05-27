const _Global = require('../maps/_Global');

class Ticket extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'tickets'});
        if (!setup || isObjectID(setup)) return;

        const Project = require('./Project');
        const Task = require('./Task');
        const PullRequest = require('./PullRequest');
        const User = require('./User');
        const Comment = require('./Comment');
        const SLAModel = require('../maps/SLA');

        const {ticketID, ticketURL, project, title, description, status, sla, tasks, pullRequests, assignedUsers, comments} = new Object(setup || {});

        try {
            this.ticketURL = ticketURL;
            this.ticketID = ticketID;
            this.title = title;
            this.description = description;
            this.status = status;
            this.project = !isObjectID(project) ? new Project(project) : {};
            this.sla = !isObjectID(sla) ? new SLAModel(sla) : {};
            this.tasks = Array.isArray(tasks) && !tasks.oid() && tasks.map(task => new Task(task));
            this.pullRequests = Array.isArray(pullRequests) && !pullRequests.oid() && pullRequests.map(pr => new PullRequest(pr));
            this.assignedUsers = Array.isArray(assignedUsers) && !assignedUsers.oid() && assignedUsers.map(user => new User(user));
            this.comments = Array.isArray(comments) && !comments.oid() && comments.map(comment => new Comment(comment));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Ticket');
        }
    }

    get displayName() {
        return `[${this.ticketID}] ${this.title}`;
    }
}

module.exports = Ticket;
