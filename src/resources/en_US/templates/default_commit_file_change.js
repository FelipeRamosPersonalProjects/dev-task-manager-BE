const Component = require('@interface/Component');

class DefaultFileChangeTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/default_commit_file_change.md');
    }

    constructor(settings) {
        super(settings, {
            filename: { type: String },
            description: { type: String }
        });
        
        const { filename, description } = new Object(settings || {});

        this.filename = filename;
        this.description = description;
    }
}

module.exports = DefaultFileChangeTemplate;
