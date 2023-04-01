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
        this.excludeProps = Array.isArray(excludeProps) ? excludeProps : ['_schema', '_id', 'index', 'author'];
    }

    getString() {
        if (!this.document) return '';
        let result = new StringTemplateBuilder().newLine().newLine();

        Object.entries(this.document).map(([key, value]) => {
            const isToExclude = this.excludeProps.find(item => item === key);
            let isNotAllowedType = false;

            if (typeof value === 'object'){
                value = JSON.stringify(value, null, 4);
            }

            if (typeof value === 'function') {
                isNotAllowedType = true;
            }

            if (!isToExclude && !isNotAllowedType) {
                if (key) {
                    result = result.indent().text(`${key}: `).newLine();
                }

                if (value) {
                    result = result.indent().text(`${value.replace(/\\n/g, '\n    ').replace(/\\/g, '')}`).newLine().newLine();
                }
            }
        });

        return result.newLine().end();
    }

    render() {
        console.log(this.getString());
    }
}

module.exports = DisplayDocument;
