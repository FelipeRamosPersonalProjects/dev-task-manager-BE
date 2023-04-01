const ToolsCLI = require('./ToolsCLI');

class NavigatorOption extends ToolsCLI {
    constructor(setup = {
        ...this,
        type: '', // nav or doc-list
        title: '',
        description: '',
        targetView: '',
        trigger: () => {},
        doc: {}
    }, index) {
        super();
        const { type, title, description, targetView, doc, trigger } = setup || {};

        if (index) this.index = String(index);
        this.type = type || 'nav';
        this.title = title;
        this.description = description;
        this.targetView = targetView;
        this.trigger = () => trigger && trigger();

        if (type === 'doc-list') {
            this.doc = doc;
        }
    }
}

module.exports = NavigatorOption;
