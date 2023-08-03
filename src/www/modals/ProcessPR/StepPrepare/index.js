const Component = require('@interface/Component');
const Spinner = require('@www/components/Spinner');
const Button = require('@www/components/DocForm/FormField/Button');
const ErrorMessage = require('@www/components/ErrorMessage');

class StepPrepare extends Component {
    get SOURCE_PATH() {
        return require.resolve('./StepPrepare.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, isCurrentClass, error, nextStep, currentBranch, headBranch } = Object(settings);
        
        if (isLoading) {
            this.isLoading = new Spinner();
        } else {
            if (error) {
                this.setError[error] && this.setError[error];
            }

            // Setting properties
            this.nextStep = nextStep;
            this.currentBranch = currentBranch;
            this.headBranch = headBranch;
            this.setButton.skip(true);

            this.setCurrent(isCurrentClass);
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

        return {
            DUPLICATED_BRANCH: (branchName) => {
                try {
                    this.errorMessage = new ErrorMessage({
                        message: `The branch name "${branchName}" is already exist! Please choose a different name on the field above.`
                    });

                    this.setButton.createBranch(true);
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        };
    }

    get setButton() {
        return {
            createRecommended: (state) => {
                if (state) {
                    this.createRecommendedButton = new Button({
                        label: 'Create ' + this.headBranch,
                        attributes: 'js="step-prepare:create-recommended"'
                    });
                } else {
                    delete this.createRecommendedButton;
                }
            },
            createBranch: (state) => {
                if (state) {
                    this.createBranchButton = new Button({
                        label: 'Create Branch',
                        attributes: 'js="step-prepare:create-branch"'
                    });
                } else {
                    delete this.createBranchButton;
                }
            },
            skip: (state) => {
                if (state) {
                    this.skipButton = new Button({
                        label: 'Skip Step',
                        attributes: 'js="step-prepare:skip"'
                    });
                } else {
                    delete this.skipButton;
                }
            },
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

module.exports = StepPrepare;
