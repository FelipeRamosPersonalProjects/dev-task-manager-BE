const Component = require('@interface/Component');
const ImportFileRequire = require('@resources/templates/code/ImportFileRequire');
const ObjectPropNoValue = require('@resources/templates/code/ObjectPropNoValue');

class SchemaClassIndex extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/SchemaClassIndex.md');
    }

    constructor(settings) {
        super(settings);

        const { newSchema, currentList } = Object(settings);
        
        this.newSchema = newSchema;
        this.newSchemaClassName = newSchema.toCamelCase() + 'Class';
        this.filesList = [];
        this.objectProps = [];

        Array.isArray(currentList) && currentList.map(item => {
            const camelName = item.id.toCamelCase();
            const className = camelName + 'Class';

            this.filesList.push({ variableName: item.id, fileName: className });
            this.objectProps.push({ propName: item.id });
        });

        this.types = {
            ImportFileRequire,
            ObjectPropNoValue
        }
    }
}

module.exports = SchemaClassIndex;
