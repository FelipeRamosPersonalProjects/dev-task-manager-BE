const ValidateSchema = require('../validation/validateSchema');

const defaultRules = {
    componentName: { type: String, default: (() => 'comp-' + Date.now())()},
    description: { type: String },
    outputModel: { type: String, default: ''}
}

class Component extends ValidateSchema {
    constructor(setup = {
        componentName: '',
        description: '',
        outputModel: ''
    }, validationRules){
        super(typeof validationRules === 'string' ? validationRules : {...defaultRules, ...validationRules});
        const self = this;

        try {
            const { componentName, description, outputModel } = setup || {};

            this.componentName = componentName;
            this.description = description;
            this.outputModel = outputModel;

            if (this.validate({...this, ...setup})) {
                throw new Error.Log(this.validationResult);
            }

            this.placeDefault();
        } catch(err) {
            const error = new Error.Log(err).append('common.required_params', err.validationErrors, this.componentName);

            Object.keys(self).map(key => delete self[key]);
            Object.keys(error).map(key => self[key] = error[key]);
            throw error.stack;
        }
    }

    string(value = '') {
        if (typeof value === 'string' || typeof value === 'number') {
            return String(value);
        } else {
            throw new Error.Log('common.bad_format_param', 'value', 'StringComponent', 'string', value, 'StringComponent.js');
        }
    }

    array(value = [], Child = () => {}) {
        let result = '';

        if (Array.isArray(value) && typeof Child === 'function') {
            value.map((item) => {
                result += Child(item);
            });
        }

        return result;
    }

    date(value) {
        try {
            const localString = new Date(value).toLocaleString();
            return localString;
        } catch(err) {
            return '--invalid-date-format--';
        }
    }

    children(children) {
        let stringResult = '';

        if (Array.isArray(children)) {
            children.map(child => stringResult += child.getString());
        } else {
            stringResult += children.getString();
        }

        return stringResult;
    }

    render(params) {
        // Find substrings between ##{{ and }}## and replace by the param value
        const regex = /##{{(.*?)}}##/g;
        const substrings = [];
        let result = this.outputModel;

        let match;
        while (match = regex.exec(this.outputModel)) {
            substrings.push(match[1]);
        }

        substrings.map(sub => {
            const [key, type] = sub.split(':');
            let value;
            let toReplaceString;

            if (type === 'string') {
                value = this.string(params[key]);
                toReplaceString = `##{{${sub}}}##`;
            }

            if (type === 'array') {
                value = this.array(params[key]);
                toReplaceString = `##{{${sub}}}##`;
            }

            if (type === 'date') {
                value = this.date(params[key]);
                toReplaceString = `##{{${sub}}}##`;
            }

            if (value) {
                result = result.replace(new RegExp(toReplaceString, 'g'), value);
            }
        });

        return result;
    }
}

module.exports = Component;
