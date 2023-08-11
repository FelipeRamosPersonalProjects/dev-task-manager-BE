const StepModel = require('../StepModel');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');
const FileChange = require('@www/components/FileChange');

class StepChangesDescription extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepChangesDescription.html');
    }

    constructor(settings, parent) {
        super(settings, parent);

        const { fileChanges } = Object(settings);

        this.isLoading = new Spinner();
        this.setButton.save(true);

        this.fileChanges = fileChanges || [];

        this.types = {
            FileChange
        };
    }

    get setError() {        
        this.error = 'error';

        return {};
    }

    get setButton() {
        return {
            save: (state) => {
                if (state) {
                    this.saveButton = new Button({
                        label: 'Save Descriptions',
                        attributes: 'js="step-changesdescription"'
                    });
                } else {
                    delete this.saveButton;
                }
            }
        };
    }

    get feedback() {
        this.setLoading(false);

        return {
            savingDescriptions: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('savingDescriptionsFeedback', 'success', `The file changes descriptions was saved successfully!`);
                        } else {
                            delete this.savingDescriptionsFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('savingDescriptionsFeedback', 'error', err.message);
                        } else {
                            delete this.savingDescriptionsFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('savingDescriptionsFeedback', 'loading', `Saving file changes descriptions...`);
                        } else {
                            delete this.savingDescriptionsFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            skipping: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('skippingFeedback', 'success', 'Step skipped!');
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

module.exports = StepChangesDescription;
