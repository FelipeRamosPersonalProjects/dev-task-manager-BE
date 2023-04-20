const ValidateSchema = require('../validation/validateSchema');
const FS = require('../services/FS');
const ToolsCLI = require('./CLI/ToolsCLI');

const defaultRules = {
    componentName: { type: String, default: () => 'comp-' + Date.now()},
    description: { type: String },
    outputModel: { type: String, default: ''},
    types: { type: Object, default: {} }
}

class Component extends ValidateSchema {
    constructor(setup = {
        componentName: '',
        description: '',
        outputModel: '',
        types: {}
    }, validationRules){
        super(typeof validationRules === 'string' ? validationRules : {...defaultRules, ...validationRules});
        const self = this;
        this.tools = new ToolsCLI();

        try {
            const { componentName, description, outputModel, types } = setup || {};

            this.componentName = componentName;
            this.description = description;
            this.outputModel = outputModel;
            this.types = types;

            this.placeDefault();

            try {
                this.outputModel = this.loadSourceFile();
                const keys = Object.keys(this.types || {});
    
                for (let key of keys) {
                    const Type = this.types[key];
                    this.types[key] = Type;
                }
    
                return this;
            } catch(err) {
                throw new Error.Log(err);
            }
        } catch(err) {
            const error = new Error.Log(err).append('common.required_params', err.validationErrors, this.componentName);

            Object.keys(self).map(key => delete self[key]);
            Object.keys(error).map(key => self[key] = error[key]);
            throw error.stack;
        }
    }

    get TEMPLATE_STRING() {
        return FS.readFileSync(this.SOURCE_PATH);
    }

    loadSourceFile(path) {
        try {
            if (!path && !this.SOURCE_PATH) {
                return this.outputModel;
            }

            const loaded = this.TEMPLATE_STRING;
            if (loaded instanceof Error.Log) {
                throw loaded;
            }

            return loaded;
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    string(value = '') {
        if (typeof value === 'string' || typeof value === 'number') {
            return String(value);
        } else {
            throw new Error.Log('common.bad_format_param', 'value', 'StringComponent', 'string', value, 'StringComponent.js');
        }
    }

    array(value = [], childTypeName) {
        const Child = this.types[childTypeName];
        let result = '';

        if (Array.isArray(value) && Child) {
            for (let item of value) {
                result += new Child(item).renderToString();
            }
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
        } else if (children) {
            stringResult += children.getString();
        }

        return stringResult;
    }

    toMarkdown(params) {
        // Find substrings between ##{{ and }}## and replace by the param value
        const regex = /##{{(.*?)}}##/g;
        const substrings = [];
        let result = this.outputModel;
        let match;

        while (match = regex.exec(this.outputModel)) {
            substrings.push(match[1]);
        }

        for (let sub of substrings) {
            const [key, type, child] = sub.split(':');
            const paramValue = params && params[key] || this[key];
            let value;
            let toReplaceString;

            if (type === 'string') {
                value = this.string(paramValue);
                toReplaceString = `##{{${sub}}}##`;
            }

            if (type === 'array') {
                value = this.array(paramValue, child);
                toReplaceString = `##{{${sub}}}##`;
            }

            if (type === 'date') {
                value = this.date(paramValue);
                toReplaceString = `##{{${sub}}}##`;
            }

            if (type === 'component') {
                value = paramValue ? paramValue.renderToString(params) : ' ';
                toReplaceString = `##{{${sub}}}##`;
            }

            if (value) {
                result = result.replace(new RegExp(toReplaceString, 'g'), value);
            }
        }

        return result;
    }

    renderToString(params) {
        try {
            const stringResult = this.toMarkdown(params);
            if (stringResult instanceof Error.Log) {
                throw stringResult;
            }

            return stringResult;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    printOnScreen(params) {
        try {
            const stringResult = this.renderToString(params);
            this.tools.printTemplate(stringResult);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Component;
