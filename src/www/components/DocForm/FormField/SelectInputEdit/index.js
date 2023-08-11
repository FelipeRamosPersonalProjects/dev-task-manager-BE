const FormField = require('..');
const SelectOption = require('@www/components/DocForm/FormField/SelectInput/SelectOption');

class SelectInputEdit extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./SelectInputEdit.html');
    }

    constructor(settings) {
        super(settings);

        const { view, options } = Object(settings);

        this.options = options;
        this.view = view || 'read';
        this.css += ' readedit-form float-input';
        this.types = {
            SelectOption
        }
    }
}

module.exports = SelectInputEdit;
