const Component = require('@interface/Component');
const SelectOption = require('./selectOption');

class SelectInput extends Component {
    get SOURCE_PATH() {
        return require.resolve('./selectInput.html');
    }

    constructor(settings) {
        super(settings);

        const { fieldName, options } = Object(settings);
        
        this.fieldName = fieldName;
        this.options = options;
        this.types = {
            SelectOption
        }
    }
}

module.exports = SelectInput;
