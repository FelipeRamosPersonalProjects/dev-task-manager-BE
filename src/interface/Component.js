const ValidateSchema = require('../validation/validateSchema');

const defaultRules = {
    title: { type: String, required: true },
    description: { type: String },
    outputModel: { type: String, default: '' }
}

class Component extends ValidateSchema {
    constructor(setup = {
        title: '',
        description: '',
        outputModel: '',
    }, validationRules){
        super(typeof validationRules === 'string' ? validationRules : {...defaultRules, ...validationRules});
        const self = this;

        try {
            const { title, description, outputModel } = setup || {};

            this.title = title;
            this.description = description;
            this.outputModel = outputModel;

            if (this.validate()) {
                throw new Error.Log(this.validationResult);
            }

            this.placeDefault();
        } catch(err) {
            const error = new Error.Log(err).append('common.required_params', err.validationErrors, this.title || 'Component Instance');

            Object.keys(self).map(key => delete self[key]);
            Object.keys(error).map(key => self[key] = error[key]);
            throw error.stack;
        }
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
                value = String(params[key]);
                toReplaceString = `##{{${sub}}}##`;
            }

            if (type === 'array') {

            }

            if (value) {
                result = result.replace(new RegExp(toReplaceString, 'g'), value);
            }
        });

        return result;
    }
}

module.exports = Component;
