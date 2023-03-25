const _Global = require('../maps/_Global');

class Organization extends _Global {
    constructor(setup = {
        ...Organization.prototype
    }){
        try {
            super({...setup, validationRules: 'organizations'});
            const { name, owner, repos, projects } = setup || {};

            this.name = name;
            this.owner = owner;
            this.repos = repos;
            this.projects = projects;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Organization');
        }
    }
}

module.exports = Organization;
