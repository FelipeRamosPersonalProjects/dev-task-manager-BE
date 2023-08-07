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

        const { isLoading, error, currentBranch, headBranch } = Object(settings);
        
        if (isLoading) {
            this.isLoading = new Spinner();
        } else {
            if (error) {
                this.setError[error] && this.setError[error];
            }

            // Setting properties
            this.currentBranch = currentBranch;
            this.headBranch = headBranch;
            this.recommendedBranch = headBranch;
            this.setButton.skip(true);
            this.setCurrent(true);

            
            if (currentBranch === headBranch) {
                this.setQuestion.stayCurrent();
                this.setButton.stayCurrentBranch(true);
            } else {
                this.setQuestion.createRecommended();
                this.setButton.createRecommended(true);
                this.setButton.switchBranch(true);
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

    setRecommended(branchName) {
        this.recommendedBranch = branchName;
    }

    get setQuestion() {
        return {
            stayCurrent: () => {
                this.question = `<p>You're already using the correct branch for the task <b>${this.headBranch}</b>. Please stay on the current branch to proceed.</p>`
            },
            createRecommended: () => {
                this.question = `<p>Would you like to create the <b>${this.headBranch}</b> branch bringing the changes with?</p>`;
            }
        };
    }

    get setError() {        
        this.error = 'error';

        return {
            DUPLICATED_BRANCH: (branchName) => {
                try {
                    this.errorMessage = new ErrorMessage({
                        message: `This pull request already have a branch with the same name. The next version name is "${branchName}" you can switch to the opened branch or create a new version.`
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
            switchBranch: (state) => {
                if (state) {
                    this.switchBranchButton = new Button({
                        label: 'Switch Branch',
                        attributes: 'js="step-prepare:switch-branch"'
                    });
                } else {
                    delete this.switchBranchButton;
                }
            },
            stayCurrentBranch: (state) => {
                if (state) {
                    this.stayCurrentBranchButton = new Button({
                        label: 'Stay on Current',
                        attributes: 'js="step-prepare:staycurrent"'
                    });
                } else {
                    delete this.stayCurrentBranchButton;
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
            }
        };
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

module.exports = StepPrepare;
