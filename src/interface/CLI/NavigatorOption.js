const ToolsCLI = require('./ToolsCLI');

class NavigatorOption extends ToolsCLI {
    constructor(setup = {
        ...this,
        type: '', // nav or doc-list
        title: '',
        description: '',
        targetView: '',
        viewParams: {},
        defaultData: {},
        trigger: () => {},
        doc: {}
    }, index) {
        super();
        const { type, title, description, targetView, doc, viewParams, defaultData, trigger } = setup || {};

        if (index) this.index = String(index);
        this.type = type || 'nav';
        this.title = title;
        this.description = description;
        this.targetView = targetView;
        this.viewParams = viewParams;
        this.trigger = trigger;
        this.defaultData = defaultData;

        if (type === 'doc-list') {
            this.doc = doc;
        }
    }
}

module.exports = NavigatorOption;
