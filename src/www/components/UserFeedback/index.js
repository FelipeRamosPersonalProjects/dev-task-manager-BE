const Component = require('@interface/Component');
const Spinner = require('../Spinner');

class UserFeedback extends Component {
    get SOURCE_PATH() {
        return require.resolve('./UserFeedback.html');
    }

    constructor(settings) {
        super(settings);

        const { state, message } = Object(settings);
        
        this.state = state || 'loading';
        this.message = message;

        if (this.state === 'loading') {
            this.spinner = new Spinner();
        } else {
            delete this.spinner;
        }

        switch (this.state) {
            case 'success': {
                this.icon = '✔️';
                break;
            }
            case 'error': {
                this.icon = '❌';
                break;
            }
        }
    }
}

module.exports = UserFeedback;
