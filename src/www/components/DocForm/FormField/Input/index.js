const FormField = require('..');

class InputField extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./Input.html');
    }

    constructor(settings) {
        super(settings);

        const { inputType } = Object(settings);

        this.inputType = inputType || 'text';
    }
}

module.exports = InputField;
