const _Global = require('../maps/_Global');
const Task = require('./Task');

class Project extends _Global {
    constructor(setup = {
        ...this,
        projectName,
        description,
        urls,
        tasks
    }){
        try {
            super({...setup, validationRules: 'projects'});

            this.projectName = projectName;
            this.description = description;
            this.urls = urls;
            this.tasks = Array.isArray(tasks) && tasks.map(task => new Task(task));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Project');
        }
    }
}

module.exports = Project;
