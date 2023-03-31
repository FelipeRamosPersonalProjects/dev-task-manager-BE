const ToolsCLI = require('./ToolsCLI');

class NavigatorOption extends ToolsCLI {
    constructor(setup = {
        title: '',
        description: '',
        targetView: ''
    }, index) {
        super();
        const { title, description, targetView } = setup || {};

        if (index) this.index = String(index);
        this.title = title;
        this.description = description;
        this.targetView = targetView;
    }

    async trigger() {
        debugger;
    }
}

module.exports = NavigatorOption;
