const _Global = require('../maps/_Global');

class Project extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'projects'}, () => this);
        if (!setup || isObjectID(setup)) return;

        const Ticket = require('./Ticket');
        const Repo = require('./Repo');
        const SpaceDesk = require('./SpaceDesk');
        const TemplateOptions = require('../maps/TemplatesOptions');
        const Task = require('./Task');

        try {
            const {projectName, description, tickets, repos, tasks, urls, spaceDesk, templates, baseBranch} = setup || {};

            this.displayName = `${projectName}`;
            this.projectName = projectName;
            this.description = description;
            this.urls = urls;
            this.tickets = !isObjectID(tickets) ? tickets.map(ticket => new Ticket(ticket)) : [];
            this.tasks = !isObjectID(tasks) ? tasks.map(task => new Task(task)) : [];
            this.repos = !isObjectID(repos) ? repos.map(repo => new Repo(repo)) : [];
            this.spaceDesk = !isObjectID(spaceDesk) ? new SpaceDesk(spaceDesk) : {};
            this.templates = !isObjectID(templates) && !isObjectID(spaceDesk) ? new TemplateOptions({...templates, ...spaceDesk.templates}) : {};
            this.baseBranch = baseBranch;

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Project');
        }
    }

    getReviewers() {
        try {
            debugger;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    getTemplate(name) {
        try {
            const template = this.templates[name];
            return template;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Project;
