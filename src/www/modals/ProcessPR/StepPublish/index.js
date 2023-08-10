const StepModel = require('../StepModel');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');

class StepPublish extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepPublish.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, isBranchExist } = Object(settings);

        this.isLoading = new Spinner();
        this.setButton.skip(true);

        if (isBranchExist && isBranchExist.isExist) {
            if (isBranchExist.isLocalExist && !isBranchExist.isRemoteExist) {
                this.setButton.publish(true);
            } else if (isBranchExist.isLocalExist && isBranchExist.isRemoteExist) {
                this.setButton.push(true);
            }
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
            skip: (state) => {
                if (state) {
                    this.skipButton = new Button({
                        label: 'Skip',
                        attributes: 'js="step-push:skip"'
                    });
                } else {
                    delete this.skipButton;
                }
            }
        };
    }
}

module.exports = StepPublish;
