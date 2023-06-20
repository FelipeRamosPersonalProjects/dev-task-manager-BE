const FormField = require('..');

class TextArea extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./TextArea.html');
    }

    constructor(settings) {
        super(settings);
    }
}

module.exports = TextArea;
