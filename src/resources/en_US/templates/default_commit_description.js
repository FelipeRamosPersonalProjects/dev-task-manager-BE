const Component = require('@interface/Component');
const CommitFileChangeTemplate = require('@templates/default_commit_file_change');

class DefaultCommitDescriptionTemplate extends Component {
    constructor(settings = {
        ...Component.prototype,
    }) {
        super(settings, {});

        const { fileChanges } = settings || {};

        this.SOURCE_PATH = require.resolve('./source/default_commit_description.md');
        this.fileChanges = fileChanges;
        this.types = {
            FileChange: CommitFileChangeTemplate
        }
        
        this.init();
    }
}

module.exports = DefaultCommitDescriptionTemplate;
