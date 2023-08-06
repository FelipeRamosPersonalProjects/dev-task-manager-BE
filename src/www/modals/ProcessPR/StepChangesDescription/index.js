const Component = require('@interface/Component');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');
const FileChange = require('@www/components/FileChange');

class StepChangesDescription extends Component {
    get SOURCE_PATH() {
        return require.resolve('./StepChangesDescription.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, fileChanges } = Object(settings);

        this.isLoading = new Spinner();
        this.setCurrent(true);
        this.setButton.save(true);

        this.fileChanges = fileChanges || [];

        this.types = {
            FileChange
        };
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

module.exports = StepChangesDescription;
