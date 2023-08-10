const StepModel = require('../StepModel');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');
const FileChange = require('@www/components/FileChange');

class StepChangesDescription extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepChangesDescription.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, fileChanges } = Object(settings);

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
}

module.exports = StepChangesDescription;
