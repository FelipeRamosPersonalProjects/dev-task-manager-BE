const FormField = require('..');
const Button = require('../Button');
const StatusOption = require('./StatusOption');

class StatusInput extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./StatusInput.html');
    }

    constructor(settings) {
        super(settings);

        const { view, options, currentValue } = Object(settings);

        this.currentValue = currentValue.displayName;
        this.view = view || 'create';

        this.options = options.map(opt => {
            if (opt.statusID === currentValue.statusID) {
                opt.selected = true;
            }

            return opt;
        });

        this.currentStatusButton = new Button({
            label: this.currentValue,
            classes: ['current-status']
        })

        this.types = {
            StatusOption
        }
    }
}

module.exports = StatusInput;
