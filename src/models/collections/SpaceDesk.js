const _Global = require('../maps/_Global');

class SpaceDesk extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'space_desks'});
        if (!setup || isObjectID(setup)) return;

        const User = require('./User');
        const Project = require('./Project');
        const Template = require('./Template');

        try {
            const { frontURL, jiraProject, jiraBaseURL, spaceName, owner, projects, templates } = Object(setup);

            this.displayName = spaceName;
            this.frontURL = frontURL;
            this.spaceName = spaceName;
            this.jiraBaseURL = jiraBaseURL;
            this.jiraProject = jiraProject;
            this.owner = owner && new User(owner);
            this.projects = Array.isArray(projects) && !projects.oid() ? projects.map(item => new Project(item)) : [];
            this.templates = Array.isArray(templates) && !templates.oid() ? templates.map(item => new Template(item)) : [];

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'SpaceDesk');
        }
    }
}

module.exports = SpaceDesk;
