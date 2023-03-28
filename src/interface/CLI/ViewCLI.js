const StringTemplateBuilder = require('../StringTemplateBuilder');
const ToolsCLI = require('./ToolsCLI');

class ViewCLI extends ToolsCLI {
    constructor(setup = {
        name: '',
        questions: [],
        navigation: {},
        Template
    }, cli) {
        super();
        const { name, questions, Template } = setup || {};

        this.Template = Template;
        this.cli = () => cli;
    }

    toString() {
        return new StringTemplateBuilder()
            .newLine()
            .newLine()
            .newLine()
            .newLine()
            .newLine()
            .text(this.Template.toString())
            .newLine()
            .newLine()
        .end();
    }

    render() {
        this.cli().printTemplate(this.toString())
    }
}

module.exports = ViewCLI;
