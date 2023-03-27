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

        this.cli = () => cli;
    }

    render() {
        this.cli().print('rendered');
    }
}

module.exports = ViewCLI;
