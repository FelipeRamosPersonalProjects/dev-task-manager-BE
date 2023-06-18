const Component = require('@interface/Component');
const FileChange = require('../default_file_change');

class DefaultPRDescription extends Component {
    constructor(settings = {
        ...Component.prototype,
        externalURL,
        taskURL,
        summary,
        fileChanges
    }) {
        super(settings, {
            externalURL: {
                type: String,
                required: true
            },
            taskURL: {
                type: String,
                required: true
            },
            summary: {
                type: String
            },
            fileChanges: {
                type: []
            },
        });

        const { externalURL, taskURL, summary, fileChanges } = settings || {};

        this.SOURCE_PATH = require.resolve('./source/default_pr_description.md');
        this.externalURL = externalURL;
        this.taskURL = taskURL;
        this.summary = summary;
        this.fileChanges = fileChanges;
        this.types = {
            FileChange
        };
    }
}

module.exports = DefaultPRDescription;
