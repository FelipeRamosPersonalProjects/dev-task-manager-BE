const Task = require('../../models/collections/Task');

class TasksClass {
    static Model = Task;

    get displayName() {
        return `[${this.externalKey}] ${this.taskName}`;
    }
}

module.exports = TasksClass;
