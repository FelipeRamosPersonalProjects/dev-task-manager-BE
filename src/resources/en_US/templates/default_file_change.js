const Component = require('@interface/Component');

class DefaultFileChangeTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/default_file_change.md');
    }
    constructor(settings = {
        ...Component.prototype,
        filename: '',
        description: ''
    }) {
        super(settings, {
            filename: { type: String },
            description: { type: String }
        });
        
        const { filename, description } = settings || {};

        this.filename = filename;
        this.description = description || '\n';
    }
}

module.exports = DefaultFileChangeTemplate;
