const Task = require('../../models/collections/Task');

class TasksClass {
    static Model = Task;

    get displayName() {
        return `[${this.externalKey || this.cod}] ${this.taskName}`;
    }
    
    get frontURL() {
        return `/tasks/read-edit/${this.index}`;
    }
}

module.exports = TasksClass;
