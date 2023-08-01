const Component = require('@interface/Component');

class ErrorMessage extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ErrorMessage.html');
    }

    constructor(settings) {
        super(settings);

        const { message } = Object(settings);
        
        this.message = message;
    }
}

module.exports = ErrorMessage;
