const { Component } = require('@src/interface');

class Button extends Component {
    get SOURCE_PATH() {
        return require.resolve('./Button.html');
    }

    constructor(settings) {
        super(settings);

        const { classes, type, attributes, label } = Object(settings);
        const classesResult = ['btn'];
        
        if (Array.isArray(classes)) {
            classes.map(item => classesResult.push(item));
        }

        this.type = type || 'button';
        this.label = label;
        this.attributes = attributes;
        this.classes = classesResult.join(' ');

        if (typeof this.attributes !== 'string') {
            Object.entries(attributes || {}).map(([key, value]) => (this.attributes += `${key}=${String(value)} `));
        }
    }
}

module.exports = Button;
