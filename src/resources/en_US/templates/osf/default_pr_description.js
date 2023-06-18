const Component = require('@interface/Component');
const FileChange = require('../default_file_change');

class DefaultPRDescription extends Component {
    constructor(settings = {
        ...Component.prototype,
        externalURL,
        externalURL,
        summary,
        fileChanges
    }) {
        super(settings, {
            externalTicketURL: {
                type: String,
                required: true
            },
            externalTaskURL: {
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

        const { externalTicketURL, externalTaskURL, summary, fileChanges } = settings || {};

        this.SOURCE_PATH = require.resolve('./source/default_pr_description.md');
        this.externalTicketURL = externalTicketURL;
        this.externalTaskURL = externalTaskURL;
        this.summary = summary;
        this.fileChanges = fileChanges;
        this.types = {
            FileChange
        };
    }
}

module.exports = DefaultPRDescription;
