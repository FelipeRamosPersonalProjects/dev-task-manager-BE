const StepModel = require('../StepModel');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');
const FileChange = require('@www/components/FileChange');
const { TextAreaEdit, InputEdit } = require('@www/components/DocForm/FormField/fields');

class StepCreatePR extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepCreatePR.html');
    }

    constructor(settings, parent) {
        super(settings, parent);

        const { isLoading, prDoc } = Object(settings);
        const { displayName, autoDescription } = Object(prDoc);

        this.isLoading = new Spinner();
        this.setButton.create(true);

        this.setTitle(displayName);
        this.setDescription(autoDescription);

        this.types = {
            FileChange
        };
    }

    setTitle(currentValue) {
        this.title = new InputEdit({
            view: 'read',
            fieldName: 'title',
            label: 'Remote Title:',
            css: ['pr-title', 'float-input'],
            currentValue
        });
    }

    setDescription(currentValue) {
        this.description = new TextAreaEdit({
            view: 'read',
            fieldName: 'description',
            label: 'Remote Description:',
            css: ['float-input'],
            currentValue
        });
    }

    get setButton() {
        return {
            create: (state) => {
                if (state) {
                    this.createButton = new Button({
                        label: 'Create Remote PR',
                        attributes: 'js="step-createpr"'
                    });
                } else {
                    delete this.createButton;
                }
            }
        };
    }

    get feedback() {
        this.setLoading(false);

        return {
            creatingPR: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('creatingPRFeedback', 'success', `The pull request was created successfully!`);
                        } else {
                            delete this.creatingPRFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('creatingPRFeedback', 'error', err.message);
                        } else {
                            delete this.creatingPRFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('creatingPRFeedback', 'loading', `Creating pull request on remote...`);
                        } else {
                            delete this.creatingPRFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            checkingRemoteConnection: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('checkingRemoteConnectionFeedback', 'success', `Remote connection is ok!`);
                        } else {
                            delete this.checkingRemoteConnectionFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('checkingRemoteConnectionFeedback', 'error', err.message);
                        } else {
                            delete this.checkingRemoteConnectionFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        this.setLoading(true);

                        if (state) {
                            this.setFeedback('checkingRemoteConnectionFeedback', 'loading', `Checking remote connection...`);
                        } else {
                            delete this.checkingRemoteConnectionFeedback;
                        }

                        subscription.toClient();
                    }
                }
            }
        }
    }
}

module.exports = StepCreatePR;
