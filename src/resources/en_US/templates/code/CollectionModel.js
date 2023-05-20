const Component = require('@interface/Component');

class CollectionModelCode extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/CollectionModelCode.md');
    }

    constructor(settings) {
        super(settings);

        const { modelName, collectionName } = Object(settings);
        
        this.modelName = modelName;
        this.collectionName = collectionName;
    }
}

module.exports = CollectionModelCode;
