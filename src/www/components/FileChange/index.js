const Component = require('@interface/Component');
const { TextArea } = require('@www/components/DocForm/FormField/fields');

class FileChange extends Component {
    get SOURCE_PATH() {
        return require.resolve('./FileChange.html');
    }

    constructor(settings) {
        super(settings);

        const { filename, patch, description } = Object(settings);
        
        this.filename = filename;
        this.patch = patch;

        this.description = new TextArea({
            label: 'File Description',
            fieldName: 'description',
            currentValue: description
        });
    }
}

module.exports = FileChange;
