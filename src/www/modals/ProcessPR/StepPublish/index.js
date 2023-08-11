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

    get feedback() {
        this.setLoading(false);

        return {
            publishing: (subscription) => {
                return {
                    setSuccess: (state, branchName) => {
                        if (state) {
                            this.setFeedback('publishingFeedback', 'success', `The branch "${branchName}" was published successfully!`);
                        } else {
                            delete this.publishingFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('publishingFeedback', 'error', err.message);
                        } else {
                            delete this.publishingFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state, branchName) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('publishingFeedback', 'loading', `The branch "${branchName}" is being published...`);
                        } else {
                            delete this.publishingFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            skipping: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('skippingFeedback', 'success', 'Step skipped! The branch is ready to be published.');
                        } else {
                            delete this.skippingFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('skippingFeedback', 'error', err.message);
                        } else {
                            delete this.skippingFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('skippingFeedback', 'loading', 'Skipping step...');
                        } else {
                            delete this.skippingFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            loadingNext: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('loadingNextFeedback', 'success', 'Ready!');
                        } else {
                            delete this.loadingNextFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('loadingNextFeedback', 'error', err.message);
                        } else {
                            delete this.loadingNextFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('loadingNextFeedback', 'loading', 'Loading next step...');
                        } else {
                            delete this.loadingNextFeedback;
                        }

                        subscription.toClient();
                    }
                }
            }
        }
    }
}

module.exports = StepPublish;
