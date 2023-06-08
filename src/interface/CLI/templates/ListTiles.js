const Component = require('@interface/Component');
const DefaultTile = require('@CLI/components/tiles/DefaultTile');

class ListTilesTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ListTiles.md');
    }

    constructor(settings) {
        super(settings);

        const { items, types } = Object(settings);

        this.items = items;
        this.types = {
            Tile: DefaultTile,
            ...types
        };
    }
}

module.exports = ListTilesTemplate;
