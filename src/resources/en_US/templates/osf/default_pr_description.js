const Component = require('../../../../interface/Component');
const FileChange = require('./default_file_change');

class DefaultPRDescription extends Component {
    get SOURCE_PATH() {
        return 'src/resources/en_US/templates/osf/source/default_pr_description.md';
    }

    constructor(settings = {
        ...Component.prototype,
        ticketURL,
        taskURL,
        summary,
        fileChanges
    }) {
        super(settings, {
            ticketURL: {
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

        const { ticketURL, taskURL, summary, fileChanges } = settings || {};

        this.ticketURL = ticketURL;
        this.taskURL = taskURL;
        this.summary = summary;
        this.fileChanges = fileChanges;
        this.types = {
            FileChange
        }
    }
}

module.exports = DefaultPRDescription;
