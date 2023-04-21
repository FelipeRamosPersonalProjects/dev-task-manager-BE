const _Global = require('../maps/_Global');

class SpaceDesk extends _Global {
    constructor(setup){
        if (!setup || isObjectID(setup)) return;
        super({...setup, validationRules: 'space_desks'});

        const User = require('./User');
        const Project = require('./Project');
        const TemplateOptions = require('../maps/TemplatesOptions');

        try {
            const { spaceName, owner, projects, templates } = setup || {};

            this.spaceName = spaceName;
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
