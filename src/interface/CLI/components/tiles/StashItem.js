const Component = require('@interface/Component');

class StashTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/StashTile.md');
    }

    constructor(settings) {
        super(settings, {
            stashIndex: { type: String },
            displayName: { type: String },
            description: { type: String }
        });

        const { displayName, stashIndex, description } = new Object(settings || {});
        
        this.stashIndex = stashIndex;
        this.displayName = displayName;
        this.description = description;
    }
}

module.exports = StashTile;
