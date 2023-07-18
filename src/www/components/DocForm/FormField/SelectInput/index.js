const FormField = require('..');
const SelectOption = require('./SelectOption');

class SelectInput extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./SelectInput.html');
    }

    constructor(settings) {
        super(settings);

        const { view, options, classes } = Object(settings);

        this.options = options;
        this.view = view || 'edit';
        this.classes = this.view === 'create' ? `class="float-input ${classes || ''}"` : `class="readedit-form float-input ${classes || ''}"`;
        this.types = {
            SelectOption
        }
    }
}

module.exports = SelectInput;
