const Task = require('../../models/collections/Task');

class TasksClass {
    static Model = Task;

    get displayName() {
        return `[${this.taskID}] ${this.taskName}`;
    }
}

module.exports = TasksClass;
