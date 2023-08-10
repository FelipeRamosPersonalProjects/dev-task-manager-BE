const StepModel = require('../StepModel');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');
const FileChange = require('@www/components/FileChange');
const { TextAreaEdit, InputEdit } = require('@www/components/DocForm/FormField/fields');

class StepCreatePR extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepCreatePR.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, prDoc } = Object(settings);
        const { title, description } = Object(prDoc);

        this.isLoading = new Spinner();
        this.setButton.create(true);

        this.setTitle(title);
        this.setDescription(description);

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
}

module.exports = StepCreatePR;
