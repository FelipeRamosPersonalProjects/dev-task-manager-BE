const _Global = require('../maps/_Global');

class Task extends _Global {
    constructor(setup = {
        ...this,
        taskName,
        taskCod,
        description,
        notes,
        project,
        assignedUser,
        tickets,
        dueDate,
        sharedWith,
        pullRequests
    }){
        try {
            super({...setup, validationRules: 'tasks'});

            this.taskName = taskName;
            this.taskCod = taskCod;
            this.description = description;
            this.notes = notes;
            this.project = project;
            this.assignedUser = assignedUser;
            this.tickets = tickets;
            this.dueDate = dueDate;
            this.sharedWith = sharedWith;
            this.pullRequests = pullRequests;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Task');
        }
    }
}

module.exports = Task;
