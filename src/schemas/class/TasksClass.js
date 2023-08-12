const Task = require('../../models/collections/Task');

class TasksClass {
    static Model = Task;
    
    get frontURL() {
        return `/tasks/read-edit/${this.index}`;
    }
}

module.exports = TasksClass;
