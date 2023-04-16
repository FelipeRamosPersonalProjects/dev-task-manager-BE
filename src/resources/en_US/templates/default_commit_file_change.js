const Component = require('@interface/Component');

class DefaultFileChangeTemplate extends Component {
    constructor(settings) {
        super(settings, {
            filename: { type: String },
            description: { type: String }
        });
        
        const { filename, description } = new Object(settings || {});

        this.SOURCE_PATH = require.resolve('./source/default_commit_file_change.md');
        this.filename = filename;
        this.description = description;
        
        this.init();
    }
}

module.exports = DefaultFileChangeTemplate;
