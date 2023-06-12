const Component = require('@interface/Component');

class SignIn extends Component {
    get SOURCE_PATH() {
        return require.resolve('./signin.html');
    }

    constructor(settings) {
        super(settings);

        const { firstField } = Object(settings);
        
        this.firstField = 'This is the variable example';
    }
}

module.exports = SignIn;
