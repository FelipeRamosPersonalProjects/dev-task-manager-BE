const _Global = require('../maps/_Global');
const Project = require('./Project');
const Task = require('./Task');
const SLAModel = require('../maps/SLA');

class Ticket extends _Global {
    constructor(setup = {
        ...this,
        ticketID: String,
        ticketURL: String,
        project: Project.prototype,
        title: String,
        description: String,
        status: String,
        sla: SLAModel.prototype,
        tasks: [Task.prototype],
        pullRequests: [Object] // To create the model for PRs when the PR schema be ready
    }){
        super({...setup, validationRules: 'tickets'});
        const {ticketID, ticketURL, project, title, description, status, sla, tasks, pullRequests} = setup || {};

        try {
            this.ticketID = ticketID;
            this.ticketURL = ticketURL;
            this.project = project;
            this.title = title;
            this.description = description;
            this.status = status;
            this.sla = sla;
            this.tasks = tasks;
            this.pullRequests = pullRequests;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Ticket');
        }
    }
}

module.exports = Ticket;
