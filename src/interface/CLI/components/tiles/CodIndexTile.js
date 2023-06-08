const Component = require('@interface/Component');

class CodIndexTileComponent extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/CodIndexTile.md');
    }

    constructor(settings) {
        super(settings);
        const { cod, displayName } = Object(settings);
        
        this.cod = cod;
        this.displayName = displayName;
    }
}

module.exports = CodIndexTileComponent;
