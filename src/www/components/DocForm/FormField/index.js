const Component = require('@interface/Component');
const collections = require('@schemas');

class FormField extends Component {
    constructor(settings) {
        super(settings);

        try {
            const { fieldName, label, placeholder, currentValue } = Object(settings);
    
            if (!fieldName) {
                throw new Error.Log({
                    name: '',
                    message: ''
                });
            }
    
            this.currentValue = currentValue || '';
            this.fieldName = fieldName || '';
            this.label = label || '';
            this.placeholder = placeholder || '';
            this.wrapperTag = this.view === 'create' ? 'div' : 'form';
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    addSchema(collectionName) {
        try {
            const collection = collections[collectionName];
            const self = this;

            if (!collections[collectionName]) {
                throw new Error.Log({
                    name: '',
                    message: ''
                });
            }

            const fieldSet = collection.getFieldSet(this.fieldName);
            this.collection = collectionName;
            Object.keys(Object(fieldSet)).map(key => {
                self[key] = fieldSet[key]
            });

            return self;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = FormField;
