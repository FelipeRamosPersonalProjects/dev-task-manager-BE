const Component = require('../../Component');

class TaskDocumentComponent extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/TaskDocument.md');
    }

    constructor(settings) {
        super(settings);
        const { externalKey, title, externalURL, taskBranch, description } = new Object(settings || {});

        this.externalKey = externalKey;
        this.title = title;
        this.externalURL = externalURL;
        this.taskBranch = taskBranch;
        this.description = description;
    }
}

module.exports = TaskDocumentComponent;
