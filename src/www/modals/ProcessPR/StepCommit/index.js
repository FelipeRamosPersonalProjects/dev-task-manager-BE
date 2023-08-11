const StepModel = require('../StepModel');
const Spinner = require('@www/components/Spinner');
const Button = require('@www/components/DocForm/FormField/Button');
const CommitFileChange = require('./CommitFileChange');
const { TextArea, Input } = require('@www/components/DocForm/FormField/fields');

class StepCommit extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepCommit.html');
    }

    constructor(settings, parent) {
        super(settings, parent);

        const { isLoading, error, currentChanges } = Object(settings);
        const { success, changes } = Object(currentChanges);
        const hasChanges = Boolean(success && Array.isArray(changes) && changes.length);

        if (error) {
            this.setError[error] && this.setError[error];
        }
        
        if (isLoading) {
            this.isLoading = new Spinner();
        }

        this.setButton.nextStep(true);
        this.fileChangesMessage = `There are ${changes.length} file changes to be commited!`;
        
        if (hasChanges) {
            this.setButton.loadChanges(true);
            this.setButton.createCommit(true);

            this.commitTitle = new Input({
                label: 'Title',
                fieldName: 'commitTitle'
            });
    
            this.commitDescription = new TextArea({
                label: 'Description',
                fieldName: 'commitDescription'
            });

            this.fileChanges = changes;
        }

        this.types = {
            CommitFileChange
        };
    }

    get setError() {        
        this.error = 'error';

        return {};
    }

    get setButton() {
        return {
            nextStep: (state) => {
                if (state) {
                    this.nextStepButton = new Button({
                        label: 'Next Step',
                        attributes: 'js="step-commit:skip"'
                    });
                } else {
                    delete this.nextStepButton;
                }
            },
            loadChanges: (state) => {
                if (state) {
                    this.loadChangesButton = new Button({
                        label: 'Add Files Description',
                        attributes: 'js="step-commit:load-changes"'
                    });
                } else {
                    delete this.loadChangesButton;
                }
            },
            createCommit: (state) => {
                if (state) {
                    this.createCommitButton = new Button({
                        label: 'Create Commit',
                        attributes: 'js="step-commit:create"'
                    });
                } else {
                    delete this.createCommitButton;
                }
            }
        };
    }

    get feedback() {
        this.setLoading(false);

        return {
            commiting: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('commitingFeedback', 'success', 'The branch is ready to be published!');
                        } else {
                            delete this.commitingFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('commitingFeedback', 'error', err.message);
                        } else {
                            delete this.commitingFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('commitingFeedback', 'loading', 'Commiting current local changes...');
                        } else {
                            delete this.commitingFeedback;
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
            gettingCurrentChanges: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('gettingCurrentChangesFeedback', 'success', `Current changes checked!`);
                        } else {
                            delete this.gettingCurrentChangesFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('gettingCurrentChangesFeedback', 'error', err.message);
                        } else {
                            delete this.gettingCurrentChangesFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('gettingCurrentChangesFeedback', 'loading', 'Getting local current changes...');
                        } else {
                            delete this.gettingCurrentChangesFeedback;
                        }

                        subscription.toClient();
                    }
                }
            }
        }
    }
}

module.exports = StepCommit;
