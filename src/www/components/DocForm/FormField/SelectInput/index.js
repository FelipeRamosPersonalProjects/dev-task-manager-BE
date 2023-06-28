const FormField = require('..');
const SelectOption = require('./SelectOption');

class SelectInput extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./SelectInput.html');
    }

    constructor(settings) {
        super(settings);

        const { view, options } = Object(settings);

        this.options = options;
        this.view = view || 'edit';
        this.types = {
            SelectOption
        }
    }
}

module.exports = SelectInput;
