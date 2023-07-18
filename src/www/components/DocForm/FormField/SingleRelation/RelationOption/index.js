const Component = require('@interface/Component');

class RelationOption extends Component {
    get SOURCE_PATH() {
        return require.resolve('./RelationOption.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, _id, selected } = Object(settings);
        
        this.displayName = displayName;
        this._id = _id;
        
        if (selected) this.selected = 'selected';
    }
}

module.exports = RelationOption;

