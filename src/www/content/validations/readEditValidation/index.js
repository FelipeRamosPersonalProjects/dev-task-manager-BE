const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/validations.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextArea } = require('@www/components/DocForm/FormField/fields');

class ValidationEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditValidation.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces, validationDoc } = Object(settings);
        const {  } = Object(validationDoc);

        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'validations',
            wrapperTag: 'div',
            fields: [
            ]
        });
    }
}

module.exports = ValidationEdit;
