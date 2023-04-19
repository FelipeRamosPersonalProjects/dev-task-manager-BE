const Component = require('@interface/Component');
const CommitFileChangeTemplate = require('@templates/default_commit_file_change');

class DefaultCommitDescriptionTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/default_commit_description.md');
    }

    constructor(settings = {
        ...Component.prototype,
    }) {
        super(settings, {});

        const { fileChanges } = settings || {};

        this.fileChanges = fileChanges;
        this.types = {
            FileChange: CommitFileChangeTemplate
        }
    }
}

module.exports = DefaultCommitDescriptionTemplate;
