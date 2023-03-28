const ToolsCLI = require('./ToolsCLI');

class NavigatorOption extends ToolsCLI {
    constructor(setup = {
        title: '',
        description: ''
    }, index) {
        super();
        const { title, description } = setup || {};

        if (index) this.index = String(index);
        this.title = title;
        this.description = description;
    }

    async trigger() {
        debugger;
    }
}

module.exports = NavigatorOption;
