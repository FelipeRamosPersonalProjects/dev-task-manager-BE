const _Global = require('../maps/_Global');

class Project extends _Global {
    constructor(setup = {
        ...this,
        projectName: '',
        description: '',
        urls: [],
        tickets: [Ticket.prototype],
        tasks: [Task.prototype],
        repos: [Repo.prototype],
        spaceDesk: [SpaceDesk.prototype],
    }){
        super({...setup, validationRules: 'projects'});
        if (!setup.isComplete && !setup.isNew) return;
        const Ticket = require('./Ticket');
        const Repo = require('./Repo');
        const SpaceDesk = require('./SpaceDesk');
        const TemplateOptions = require('../maps/TemplatesOptions');
        const Task = require('./Task');

        try {
            const {projectName, description, tickets, repos, tasks, urls, spaceDesk, templates, baseBranch} = setup || {};

            this.displayName = `[${this.cod}] ${projectName}`;
            this.projectName = projectName;
            this.description = description;
            this.urls = urls;
            this.tickets = Array.isArray(tickets) ? tickets.map(ticket => new Ticket(ticket)) : [];
            this.tasks = Array.isArray(tasks) ? tasks.map(task => new Task(task)) : [];
            this.repos = Array.isArray(repos) ? repos.map(repo => new Repo(repo)) : [];
            this.spaceDesk = spaceDesk ? new SpaceDesk(spaceDesk) : {};
            this.templates = new TemplateOptions({...templates, ...this.spaceDesk.templates});
            this.baseBranch = baseBranch;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Project');
        }
    }

    getReviewers() {
        try {
            debugger;
        } catch (err) {
            throw new Error.Log({
                name: '',
                message: ''
            });
        }
    }

    getTemplate(name) {
        try {
            const template = this.templates[name];
            return template;
        } catch (err) {
            throw new Error.Log({
                name: '',
                message: ''
            });
        }
    }
}

module.exports = Project;
