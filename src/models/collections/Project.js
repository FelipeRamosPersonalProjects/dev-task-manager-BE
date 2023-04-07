const _Global = require('../maps/_Global');
const Ticket = require('./Ticket');
const Repo = require('./Repo');
const SpaceDesk = require('./SpaceDesk');

class Project extends _Global {
    constructor(setup = {
        ...this,
        projectName: '',
        description: '',
        urls: [],
        tickets: [Ticket.prototype],
        tasks: [Task.prototype],
        repos: [Repo.prototype],
        spaceDesks: [SpaceDesk.prototype],
    }){
        super({...setup, validationRules: 'projects'});
        if (!setup.isComplete && !setup.isNew) return;
        const Task = require('./Task');

        try {
            const {projectName, description, tickets, repos, tasks, urls, spaceDesks} = setup || {};

            this.displayName = `[${this.cod}] ${projectName}`;
            this.projectName = projectName;
            this.description = description;
            this.urls = urls;
            this.tickets = Array.isArray(tickets) ? tickets.map(ticket => new Ticket(ticket)) : [];
            this.tasks = Array.isArray(tasks) ? tasks.map(task => new Task(task)) : [];
            this.repos = Array.isArray(repos) ? repos.map(repo => new Repo(repo)) : [];
            this.spaceDesks = Array.isArray(spaceDesks) ? spaceDesks.map(spaceDesk => new SpaceDesk(spaceDesk)) : [];

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Project');
        }
    }
}

module.exports = Project;
