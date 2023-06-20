const Component = require('@interface/Component');

class DocForm extends Component {

    get SOURCE_PATH() {
        return require.resolve('./DocForm.html');
    }

    constructor(settings) {
        super(settings);

        const { collection, fields, wrapperTag } = Object(settings);

        this.wrapperTag = wrapperTag || 'form';
        this.fields = Array.isArray(fields) ? fields.map(item => item.addSchema(collection)) : [];
    }

    static getForm(formName) {
        try {
            const form = configs[formName];

            if (!form) {
                throw new Error.Log({
                    name: '',
                    message: ''
                });
            }

            return form;
        } catch (err) {
            new Error.Log(err);
        }
    }
}

module.exports = DocForm;
