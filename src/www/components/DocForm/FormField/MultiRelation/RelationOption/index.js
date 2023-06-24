const Component = require('@interface/Component');

class RelationOption extends Component {
    get SOURCE_PATH() {
        return require.resolve('./RelationOption.html');
    }

    constructor(settings) {
        super(settings);

        const { uniqueID, displayName, _id, selected } = Object(settings);
        
        this.uniqueID = uniqueID;
        this.displayName = displayName;
        this._id = _id;

        if (selected) {
            this.checked = 'checked'
        }
    }
}

module.exports = RelationOption;

