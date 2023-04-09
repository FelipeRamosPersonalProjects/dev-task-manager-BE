const Component = require('../../Component');
const StringTemplateBuilder = require('../../StringTemplateBuilder');

class DisplayDocument extends Component {
    constructor (setup = {
        ...this,
        document: {},
        excludeProps: []
    }) {
        super(setup);
        const { document, excludeProps } = setup || {};

        this.document = document;
        this.excludeProps = Array.isArray(excludeProps) ? excludeProps : ['_schema', '_id', 'index', 'author', 'ModelDB'];
        this.outputModel = this.getString();
    }

    getString(obj, indentTimes = 0) {
        if (!obj && !this.document) return '';
        let result = new StringTemplateBuilder();
        const indentation = (indentTimes + 1) * result.indentation;

        Object.entries(obj || this.document).map(([key, value]) => {
            const isToExclude = this.excludeProps.find(item => item === key);
            let isNotAllowedType = false;

            if (typeof value === 'function') {
                isNotAllowedType = true;
            }

            if (!isToExclude && !isNotAllowedType) {               
                if (key) {
                    result = result.indent(indentation).text(`${key}: `).newLine();
                }

                if (typeof value === 'object'){
                    if (Array.isArray(value)) {
                        const ind =  indentTimes + 1;
                        value.map(val => {
                            result = result.text(this.getString(val, ind));
                        });
                    } else {
                        result = result = result.text(this.getString(value, indentTimes + 1));
                    }
                } else if (value && typeof value === 'string') {
                    result = result.indent(indentation).text(`${value}`).newLine().newLine();
                } else {
                    result = result.indent(indentation).text('--empty--').newLine().newLine();
                }
            }
        });

       return result.end();
    }

    render() {
        console.log(this.getString());
    }
}

module.exports = DisplayDocument;
