const Component = require('../../../../interface/Component');

class DefaultFileChangeTemplate extends Component {
    get SOURCE_PATH() {
        return 'src/resources/en_US/templates/osf/source/default_file_change.md';
    }

    constructor(settings = {
        ...Component.prototype,
        filename: ''
    }) {
        super(settings, {
            filename: { type: String }
        });

        const { filename } = settings || {};

        this.filename = filename;
    }
}

module.exports = DefaultFileChangeTemplate;
