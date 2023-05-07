const _Global = require('../maps/_Global');
const User = require('./User');
const Repo = require('./Repo');
const Project = require('./Project');

class Organization extends _Global {
    constructor(setup){
        try {
            super({...setup, validationRules: 'organizations'}, this);
            if (!setup || isObjectID(setup)) return;
            const { name, owner, repos, projects } = setup || {};

            this.name = name;
            this.owner = owner && new User(owner);
            this.repos = Array.isArray(repos) && repos.map(repo => new Repo(repo));
            this.projects = Array.isArray(projects) && projects.map(project => new Project(project));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Organization');
        }
    }
}

module.exports = Organization;
