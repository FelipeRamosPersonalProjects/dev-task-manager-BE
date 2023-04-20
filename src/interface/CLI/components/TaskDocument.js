const Component = require('../../Component');

class TaskDocumentComponent extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/TaskDocument.md');
    }

    constructor(settings) {
        super(settings);
        const { taskID, taskName, taskURL, taskBranch, description } = new Object(settings || {});

        this.taskID = taskID;
        this.taskName = taskName;
        this.taskURL = taskURL;
        this.taskBranch = taskBranch;
        this.description = description;
    }
}

module.exports = TaskDocumentComponent;
