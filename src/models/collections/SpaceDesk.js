const _Global = require('../maps/_Global');
const User = require('./User');
const Project = require('./Project');

class SpaceDesk extends _Global {
    constructor(setup = {
        ...SpaceDesk.prototype,
        owner: User.prototype,
        projects: [Project.prototype]
    }){
        super({...setup, validationRules: 'space_desks'});
        if (!setup.isComplete && !setup.isNew) return;

        try {
            const { spaceName, owner, projects } = setup || {};

            this.spaceName = spaceName;
            this.owner = owner && new User(owner);
            this.projects = Array.isArray(projects) && projects.map(project => new Project(project));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'SpaceDesk');
        }
    }
}

module.exports = SpaceDesk;
