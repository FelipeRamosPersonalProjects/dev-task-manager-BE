const Component = require('@interface/Component');

class StatusOption extends Component {
    get SOURCE_PATH() {
        return require.resolve('./StatusOption.html');
    }

    constructor(settings) {
        super(settings);

        const { collection, docUID, statusID, transitionID, displayName, selected } = Object(settings);

        this.collection = collection;
        this.docUID = docUID;
        this.statusID = statusID;
        this.transitionID = transitionID;
        this.displayName = displayName;

        if (selected) {
            this.selected = 'disabled'
        }
    }
}

module.exports = StatusOption;
