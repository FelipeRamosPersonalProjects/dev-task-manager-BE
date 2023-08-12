const FormField = require('..');

class TextArea extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./TextAreaEdit.html');
    }

    constructor(settings) {
        super(settings);

        this.css += ' readedit-form float-input';
    }
}

module.exports = TextArea;
