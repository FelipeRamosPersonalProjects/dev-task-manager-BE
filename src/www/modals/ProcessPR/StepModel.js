const Component = require('@interface/Component');
const UserFeedback = require('@www/components/UserFeedback');

class PullRequestStep extends Component {
    constructor(setup, parent) {
        super(setup);

        try {
            this.setCurrent(true);
            this._parent = () => parent;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get parent() {
        return this._parent() || {};
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

    setLoading(state) {
        try {
            if (state) {
                this.loadingClass = 'loading';
            } else {
                this.loadingClass = '';
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

    setFeedback(propName, state, message) {
        try {
            if (state) {
                this.parent.addLog(message);
                this[propName] = new UserFeedback({ state, message });
            } else {
                delete this[propName];
            }
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
