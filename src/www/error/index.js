const Component = require('@interface/Component');

class Error extends Component {
    get SOURCE_PATH() {
        return require.resolve('./error.html');
    }

    constructor(settings) {
        super(settings);

        const { code, name, message } = Object(settings);

        this.code = code;
        this.name = name;
        this.message = message;
    }
}

module.exports = Error;
