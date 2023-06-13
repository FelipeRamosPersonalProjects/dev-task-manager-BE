const Component = require('@interface/Component');

class SignUp extends Component {
    get SOURCE_PATH() {
        return require.resolve('./signup.html');
    }

    constructor(settings) {
        super(settings);

        const {  } = Object(settings);
    }
}

module.exports = SignUp;
