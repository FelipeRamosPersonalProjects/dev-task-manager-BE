const Component = require('@interface/Component');
const ImportFileRequire = require('@resources/templates/code/ImportFileRequire');
const ObjectPropNoValue = require('@resources/templates/code/ObjectPropNoValue');

class SchemasIndex extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/SchemasIndex.md');
    }

    constructor(settings) {
        super(settings);

        const { newSchema, currentList } = Object(settings);
        
        this.newSchema = newSchema;
        this.filesList = [];
        this.objectProps = [];

        Array.isArray(currentList) && currentList.map(item => {
            this.filesList.push({ variableName: item.id, fileName: item.id });
            this.objectProps.push({ propName: item.id });
        });

        this.types = {
            ImportFileRequire,
            ObjectPropNoValue
        }
    }
}

module.exports = SchemasIndex;
