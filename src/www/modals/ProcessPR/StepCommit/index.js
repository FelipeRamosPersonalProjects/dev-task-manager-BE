const StepModel = require('../StepModel');
const Spinner = require('@www/components/Spinner');
const Button = require('@www/components/DocForm/FormField/Button');
const CommitFileChange = require('./CommitFileChange');
const { TextArea, Input } = require('@www/components/DocForm/FormField/fields');

class StepCommit extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepCommit.html');
    }

    constructor(settings) {
        super(settings);

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
}

module.exports = StepCommit;
