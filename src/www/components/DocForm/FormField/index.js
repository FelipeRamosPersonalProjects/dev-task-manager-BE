const Component = require('@interface/Component');
const collections = require('@schemas');

class FormField extends Component {
    constructor(settings) {
        super(settings);

        try {
            const { fieldName, label, placeholder, currentValue, css, wrapperTag, attr, notField } = Object(settings);
    
            if (!fieldName && !notField) {
                throw new Error.Log({
                    name: 'FIELD_NAME_REQUIRED',
                    message: `It's required to provide a fieldName param!`
                });
            }
    
            this.currentValue = currentValue || '';
            this.fieldName = fieldName || '';
            this.label = label || '';
            this.placeholder = placeholder || '';
            this.wrapperTag = wrapperTag || (this.view === 'create' ? 'div' : 'form');
            this.css = '';
            this.attr = Object(attr);
            this.attributesHTML = '';

            if (Array.isArray(css)) {
                this.css = css.join(' ');
            }

            Object.keys(this.attr).map(key => (this.attributesHTML += ` ${key}="${this.attr[key]}"`))
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
