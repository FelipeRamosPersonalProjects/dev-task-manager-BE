const Component = require('@interface/Component');

class SelectOption extends Component {
    get SOURCE_PATH() {
        return require.resolve('./SelectOption.html');
    }

    constructor(settings) {
        super(settings);

        const { label, value } = Object(settings);
        
        this.label = label;
        this.value = value;
    }
}

module.exports = SelectOption;

