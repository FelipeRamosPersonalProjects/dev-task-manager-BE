const FormField = require('..');
const Button = require('../Button');

class InputEditField extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./InputEdit.html');
    }

    constructor(settings) {
        super(settings);

        const { inputType, view } = Object(settings);

        this.inputType = inputType || 'text';
        this.view = view || 'read';
        this.editButton = new Button({
            label: '✏️',
            classes: ['edit-btn'],
            attributes: 'view="read"'
        });
    }
}

module.exports = InputEditField;
