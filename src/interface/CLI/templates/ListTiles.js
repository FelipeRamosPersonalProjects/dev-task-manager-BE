const Component = require('@interface/Component');
const DefaultTile = require('@CLI/templates/tiles/DefaultTile');

class ListTileTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ListTiles.md');
    }

    constructor(settings) {
        super(settings, {
            items: { type: [Object], default: [] }
        });

        const { items, types } = new Object(settings || {});

        this.items = items;
        this.types = {
            Tile: DefaultTile,
            ...types
        };
    }
}

module.exports = ListTileTemplate;
