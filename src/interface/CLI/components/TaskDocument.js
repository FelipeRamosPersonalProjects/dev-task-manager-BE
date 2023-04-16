const Component = require('../../Component');

class TaskDocumentComponent extends Component {
    constructor(settings = {
        ...Component.prototype
    }) {
        super(settings);
        const { taskID, taskName, taskURL, taskBranch, description } = settings || {};

        this.SOURCE_PATH = require.resolve('./source/TaskDocument.md');
        this.taskID = taskID;
        this.taskName = taskName;
        this.taskURL = taskURL;
        this.taskBranch = taskBranch;
        this.description = description;
        
        this.init();
    }
}

module.exports = TaskDocumentComponent;
