const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea } = require('@www/components/DocForm/FormField/fields');

class ValidationCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createValidation.html');
    }

    constructor(settings) {
        super(settings);

        const {  } = Object(settings);

        this.docForm = new DocForm({
            collection: 'validations',
            fields: [
            ]
        });
    }
}

module.exports = ValidationCreate;
