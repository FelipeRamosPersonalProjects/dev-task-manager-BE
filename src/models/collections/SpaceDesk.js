const _Global = require('../maps/_Global');

class SpaceDesk extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'space_desks'});
        if (!setup || isObjectID(setup)) return;

        const User = require('./User');
        const Project = require('./Project');
        const TemplateOptions = require('../maps/TemplatesOptions');

        try {
            const { jiraProject, jiraBaseURL, spaceName, owner, projects, templates } = setup || {};

            this.displayName = spaceName;
            this.spaceName = spaceName;
            this.jiraBaseURL = jiraBaseURL;
            this.jiraProject = jiraProject;
            this.owner = owner && new User(owner);
            this.projects = Array.isArray(projects) && projects.map(project => new Project(project));
            this.templates = new TemplateOptions(templates || {});

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'SpaceDesk');
        }
    }
}

module.exports = SpaceDesk;
