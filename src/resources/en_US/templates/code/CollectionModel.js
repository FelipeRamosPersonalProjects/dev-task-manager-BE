const Component = require('@interface/Component');
const ObjectPropNoValue = require('./ObjectPropNoValue');
const ThisDeclaration = require('./ThisDeclaration');

class CollectionModel extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/CollectionModel.md');
    }

    constructor(settings) {
        super(settings);

        const { modelName, collectionName, schemaObj } = Object(settings);
        
        this.modelName = modelName;
        this.collectionName = collectionName;
        this.schemaObj = [];

        Object.entries(schemaObj).map(([key, value]) => {
            this.schemaObj.push({ propName: key, ...value});
        });

        this.types = {
            ObjectPropNoValue,
            ThisDeclaration
        }
    }
}

module.exports = CollectionModel;
