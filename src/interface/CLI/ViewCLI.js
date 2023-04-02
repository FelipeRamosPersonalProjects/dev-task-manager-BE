const StringTemplateBuilder = require('../StringTemplateBuilder');
const ToolsCLI = require('./ToolsCLI');
const ViewNavigator = require('./ViewNavigator');

class ViewCLI extends ToolsCLI {
    static ViewNavigator = ViewNavigator;

    constructor(setup = {
        name: '',
        poolForm: PoolForm.prototype,
        navigator: ViewNavigator.prototype,
        Template
    }, cli) {
        super(setup);
        const PoolForm = require('./PoolForm');
        const { name, poolForm, navigator, Template } = setup || {};

        if (!cli) throw new Error.Log('common.missing_params', 'cli', 'ViewCLI', 'ViewCLI.js');

        this.name = name;
        this.Template = Template;
        this.poolForm = poolForm && new PoolForm(poolForm, this);
        this.navigator = navigator && new ViewNavigator(navigator, this);
        
        if (!this.poolForm) {
            this.poolForm = new PoolForm(ViewNavigator.navDefaultQuestions, this);
            this.poolForm.setListener('onAnswer', (_, answer) => {
                this.navigator.navTo(answer);
            });
        }

        this.cli = () => cli;
    }

    goToView(viewPath, params) {
        try {
            this.cli().loadView(viewPath, params);
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    getString() {
        if (this.Template) {
            return new StringTemplateBuilder()
                .newLine().newLine().newLine()
                .text(this.Template.getString())
            .end();
        } else {
            return '';
        }
    }

    render(tableHeaders) {
        try {
            this.cli().printTemplate(this.getString());

            if (this.navigator) {
                this.navigator.render(tableHeaders);
            }

            if (this.poolForm) {
                this.poolForm.start();
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ViewCLI;
