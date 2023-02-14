const _Global = require('./maps/_Global');

class Project extends _Global {
    constructor(setup = {
        ...this,
        projectName,
        description,
        links,
        tasks
    }){
        try {
            super({...setup, validationRules: 'projects'});

            this.projectName = projectName;
            this.description = description;
            this.links = links;
            this.tasks = tasks;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Project');
        }
    }
}

module.exports = Project;
