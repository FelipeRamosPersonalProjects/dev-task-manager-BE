class StringTemplateBuilder {
    constructor(setup = {
        indentation: 4
    }) {
        const { indentation } = setup || {};

        this.result = '';
        this.indentation = indentation;
    }

    text(value) {
        this.result += String(value);
        return this;
    }

    newLine() {
        this.result += '\n';
        return this;
    }

    var(name, type) {
        if (!name || !type) {
            throw new Error.Log('common.missing_params', ['name', 'type']);
        }

        this.result += `##{{${name}:${type}}}##`;
        return this;
    }

    tab() {
        return this.indent(this.indentation);
    }

    indent(indentation) {
        if (!indentation) {
            indentation = this.indentation;
        }

        for (let i = 0; i < indentation; i++) {
            this.result += ' ';
        }

        return this;
    }

    end() {
        return this.result;
    }
}

module.exports = StringTemplateBuilder;
