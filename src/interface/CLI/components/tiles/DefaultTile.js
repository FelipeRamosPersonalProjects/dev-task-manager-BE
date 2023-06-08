const Component = require('@interface/Component');

class DefaultTileTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/DefaultTile.md');
    }

    constructor(setup) {
        super(setup, {
            index: { type: String || Number },
            displayName: { type: String }
        });

        const { index, displayName } = Object(setup);

        this.index = String(index);
        this.displayName = displayName;
    }
}

module.exports = DefaultTileTemplate;
