const Component = require('@interface/Component');

class PullRequestStep extends Component {
    constructor(setup) {
        super(setup);

        try {
            this.setCurrent(true);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get setters() {
        return {};
    }

    get setError() {        
        this.error = 'error';
        return {};
    }

    get setButton() {
        return {};
    }

    setCurrent(state) {
        try {
            if (state) {
                this.isCurrentClass = 'current-step';
            } else {
                this.isCurrentClass = '';
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    removeError() {
        try {
            delete this.error;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    resolve() {
        try {
            this.resolved = true;
            this.setCurrent(false);
            this.removeError();

            // Hiding the buttons
            Object.keys(this.setButton).map(key => this.setButton[key](false));
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = PullRequestStep;
