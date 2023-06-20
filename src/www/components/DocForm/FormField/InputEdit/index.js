const FormField = require('..');

class InputEditField extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./InputEdit.html');
    }

    constructor(settings) {
        super(settings);

        const { inputType, view } = Object(settings);

        this.inputType = inputType || 'text';
        this.view = view || 'read';
    }
}

module.exports = InputEditField;
