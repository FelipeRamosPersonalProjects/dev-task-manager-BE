const Component = require('@interface/Component');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');

class StepPublish extends Component {
    get SOURCE_PATH() {
        return require.resolve('./StepPublish.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, isBranchExist } = Object(settings);

        this.isLoading = new Spinner();

        this.setCurrent(true);
        this.setButton.leave(true);

        if (isBranchExist && isBranchExist.isExist) {
            if (isBranchExist.isLocalExist && !isBranchExist.isRemoteExist) {
                this.setButton.publish(true);
            } else if (isBranchExist.isLocalExist && isBranchExist.isRemoteExist) {
                this.setButton.push(true);
            }
        }
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

    get setError() {        
        this.error = 'error';

        return {};
    }

    get setButton() {
        return {
            publish: (state) => {
                if (state) {
                    this.publishButton = new Button({
                        label: 'Publish',
                        attributes: 'js="step-push"'
                    });
                } else {
                    delete this.publishButton;
                }
            },
            push: (state) => {
                if (state) {
                    this.pushButton = new Button({
                        label: 'Push',
                        attributes: 'js="step-push:push"'
                    });
                } else {
                    delete this.pushButton;
                }
            },
            leave: (state) => {
                if (state) {
                    this.leaveButton = new Button({
                        label: 'Leave',
                        attributes: 'js="step-push:leave"'
                    });
                } else {
                    delete this.leaveButton;
                }
            }
        };
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

module.exports = StepPublish;
