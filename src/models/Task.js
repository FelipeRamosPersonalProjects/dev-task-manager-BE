const _Global = require('./maps/_Global');

class Task extends _Global {
    constructor(setup = {
        ...this,
        project
    }){
        try {
            super({...setup, validationRules: 'tasks'});

            this.project = project;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Task');
        }
    }
}

module.exports = Task;
