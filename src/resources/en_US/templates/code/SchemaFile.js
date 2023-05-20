const Component = require('@interface/Component');

class SchemaFile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/SchemaFile.md');
    }

    constructor(settings) {
        super(settings);

        const { collectionName, symbol } = Object(settings);
        
        this.collectionName = collectionName;
        this.symbol = symbol;
    }
}

module.exports = SchemaFile;
