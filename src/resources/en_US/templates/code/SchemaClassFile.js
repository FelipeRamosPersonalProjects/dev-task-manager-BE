const Component = require('@interface/Component');

class SchemaClassFile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/SchemaClassFile.md');
    }

    constructor(settings) {
        super(settings);

        const { className, modelName } = Object(settings);
        
        this.className = className;
        this.modelName = modelName;
    }
}

module.exports = SchemaClassFile;
