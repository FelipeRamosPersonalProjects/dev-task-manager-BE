const Component = require('@interface/Component');

class Paragraph extends Component {
    get SOURCE_PATH() {
        return require.resolve('./Paragraph.html');
    }

    constructor(settings) {
        super(settings);

        const { text } = Object(settings);
        
        this.text = text.replace(/\n/g, '\n   ');
    }
}

module.exports = Paragraph;
