const StringTemplateBuilder = require('../StringTemplateBuilder');
const ToolsCLI = require('./ToolsCLI');
const ViewNavigator = require('./ViewNavigator');

class ViewCLI extends ToolsCLI {
    static ViewNavigator = ViewNavigator;

    constructor(setup = {
        name: '',
        questions: Questions.prototype,
        navigator: ViewNavigator.prototype,
        Template
    }, cli) {
        super(setup);
        const Questions = require('./Questions');
        const { name, questions, navigator, Template } = setup || {};

        this.name = name;
        this.Template = Template;
        this.questions = questions && new Questions(questions, this);
        this.navigator = navigator && new ViewNavigator(navigator, this);
        
        if (!this.questions) {
            this.questions = new Questions(ViewNavigator.navDefaultQuestions, this);
            this.questions.setListener('onAnswer', (_, answer) => {
                this.navigator.navTo(answer);
            });
        }

        this.cli = () => cli;
    }

    goToView(viewPath) {
        try {
            this.cli().loadView(viewPath);
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

            if (this.questions) {
                this.questions.start();
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ViewCLI;
