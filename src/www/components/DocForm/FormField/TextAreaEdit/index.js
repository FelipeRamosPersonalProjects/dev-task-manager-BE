const FormField = require('..');

class TextArea extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./TextAreaEdit.html');
    }

    constructor(settings) {
        super(settings);

        const { inputType } = Object(settings);

        this.inputType = inputType || 'div';

        if (this.inputType === 'textarea') {
            this.fieldType = 'textarea';
        } else {
            this.fieldType = 'html-editor';
        }

        this.css += ' readedit-form float-input';
    }
}

module.exports = TextArea;
