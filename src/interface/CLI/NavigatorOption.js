const ToolsCLI = require('./ToolsCLI');

class NavigatorOption extends ToolsCLI {
    constructor(setup = {
        ...this,
        type: '', // nav or doc-list
        title: '',
        description: '',
        targetView: '',
        doc: {}
    }, index) {
        super();
        const { type, title, description, targetView, doc } = setup || {};

        if (index) this.index = String(index);
        this.type = type || 'nav';
        this.title = title;
        this.description = description;
        this.targetView = targetView;

        if (type === 'doc-list') {
            this.doc = doc;
        }
    }

    async trigger() {
        debugger;
    }
}

module.exports = NavigatorOption;
