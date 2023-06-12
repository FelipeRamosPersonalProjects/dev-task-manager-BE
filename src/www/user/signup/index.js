const Component = require('@interface/Component');

class SignUp extends Component {
    get SOURCE_PATH() {
        return require.resolve('./signup.html');
    }

    constructor(settings) {
        super(settings);

        const { firstField } = Object(settings);
        
        this.firstField = 'This is the variable example';
    }
}

module.exports = SignUp;
