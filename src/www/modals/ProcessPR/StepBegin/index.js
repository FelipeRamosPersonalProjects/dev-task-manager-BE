const StepModel = require('../StepModel');
const BranchSwitcher = require('@src/www/components/BranchSwitcher');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');

class StepBegin extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepBegin.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, error, subscriptionUID, branchSwitcher, nextStep } = Object(settings);
        
        if (isLoading) {
            this.isLoading = new Spinner();
        } else {
            if (error) {
                this.setError[error] && this.setError[error];
            }

            // Setting properties
            this.subscriptionUID = subscriptionUID;
            this.nextStep = nextStep;

            // Configuring elements to render
            this.setters.branchSwitcher(branchSwitcher);
            this.setButton.start(true);
            this.setButton.ignore(false);
            this.setButton.switchToBase(false);
        }
    }

    get setters() {
        return {
            branchSwitcher: (value) => {
                if (value) {
                    this.branchSwitcher = new BranchSwitcher(value);
                }
            }
        }
    }

    get setError() {        
        this.error = 'error';

        return {
            BAD_BRANCH_NAME: () => {
                try {
                    this.setCurrent(true);
                    this.branchSwitcher.setError.BAD_BRANCH_NAME();

                    this.setButton.start(false);
                    this.setButton.ignore(true);
                    this.setButton.switchToBase(true);
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        };
    }

    get setButton() {
        return {
            start: (state) => {
                if (state) {
                    this.startButton = new Button({
                        label: 'Start',
                        classes: ['begin-btn'],
                        attributes: 'js="step-begin"'
                    });
                } else {
                    delete this.startButton;
                }
            },
            ignore: (state) => {
                if (state) {
                    this.ignoreButton = new Button({
                        label: 'Ignore',
                        classes: ['ignore-btn'],
                        attributes: 'js="step-begin:ignore"'
                    });
                } else {
                    delete this.ignoreButton;
                }
            },
            switchToBase: (state) => {
                if (state) {
                    this.switchToBaseButton = new Button({
                        label: 'Switch to base branch',
                        classes: ['switchbranch-btn'],
                        attributes: 'js="step-begin:switchbranch:base"'
                    });
                } else {
                    delete this.switchToBaseButton;
                }
            }
        };
    }
}

module.exports = StepBegin;
