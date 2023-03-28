const StringTemplateBuilder = require('../StringTemplateBuilder');
const ToolsCLI = require('./ToolsCLI');
const ViewNavigator = require('./ViewNavigator');

class ViewCLI extends ToolsCLI {
    static ViewNavigator = ViewNavigator;

    constructor(setup = {
        name: '',
        questions: [],
        navigator: ViewNavigator.prototype,
        Template
    }, cli) {
        super(setup);
        const { name, questions, navigator, Template } = setup || {};

        this.name = name;
        this.questions = questions;
        this.Template = Template;
        this.navigator = navigator && new ViewNavigator(navigator || {}, this);

        this.cli = () => cli;
    }

    goToView(viewName) {
        try {
            this.cli().loadView(viewName);
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    getString() {
        return new StringTemplateBuilder()
            .newLine().newLine().newLine().newLine().newLine()
            .text(this.Template.getString())
        .end();
    }

    render(tableHeaders) {
        try {
            this.cli().printTemplate(this.getString());

            if (this.navigator) {
                this.navigator.render(tableHeaders);
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ViewCLI;
