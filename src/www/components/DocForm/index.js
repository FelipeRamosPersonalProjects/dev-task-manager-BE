const Component = require('@interface/Component');

class DocForm extends Component {

    get SOURCE_PATH() {
        return require.resolve('./DocForm.html');
    }

    constructor(settings) {
        super(settings);

        const { collection, fields, wrapperTag, classes } = Object(settings);

        this.collection = collection;
        this.wrapperTag = wrapperTag || 'form';
        this.classes = classes ? `class="docform ${classes}"` : 'class="docform"';
        this.fields = Array.isArray(fields) ? fields.map(item => {
            item.collection = collection;
            item.addSchema(collection);
            return item;
        }) : [];
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
