const Component = require('@interface/Component');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');
const FileChange = require('@www/components/FileChange');
const { TextAreaEdit, InputEdit } = require('@www/components/DocForm/FormField/fields');

class StepCreatePR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./StepCreatePR.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, prDoc } = Object(settings);
        const { title, description } = Object(prDoc);

        this.isLoading = new Spinner();
        this.setCurrent(true);
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

    removeError() {
        try {
            delete this.error;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get setError() {        
        this.error = 'error';

        return {};
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

module.exports = StepCreatePR;
