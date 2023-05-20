const Component = require('@interface/Component');

class CollectionModel extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/CollectionModel.md');
    }

    constructor(settings) {
        super(settings);

        const { modelName, collectionName, schemaObj } = Object(settings);
        
        this.modelName = modelName;
        this.collectionName = collectionName;
        this.schemaObj = schemaObj;
    }
}

module.exports = CollectionModel;
