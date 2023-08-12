const _Global = require('@models/maps/_Global');
const ComponentModel = require('@interface/Component');

class Template extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'templates'}, parent);
        if (!setup || isObjectID(setup)) return;

        const User = require('./User');
        const SpaceDesk = require('./SpaceDesk');
        const Organization = require('./Organization');
        const Project = require('./Project');
        
        try {
            const {
                displayName,
                frontURL,
                title,
                type,
                summary,
                body,
                author,
                organizations,
                spaces,
                projects,
            } = Object(setup);

            this.displayName = displayName;
            this.frontURL = frontURL;
            this.title = title;
            this.type = type;
            this.summary = summary;
            this.body = body;
            this.author = !Object(author).oid() ? new User(author, this) : null;
            this.organizations = Array.isArray(organizations) && !organizations.oid() && organizations.map(item => new Organization(item, this));
            this.spaces = Array.isArray(spaces) && !spaces.oid() && spaces.map(item => new SpaceDesk(item, this));
            this.projects = Array.isArray(projects) && !projects.oid() && projects.map(item => new Project(item, this));

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Template');
        }
    }

    get Component() {
        return new ComponentModel({ outputModel: this.body });
    }
}

module.exports = Template;
