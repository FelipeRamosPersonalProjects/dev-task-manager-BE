const Component = require('@interface/Component');

class ImportFileRequire extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ImportFileRequire.md');
    }

    constructor(settings) {
        super(settings);
        const { variableName, fileName } = Object(settings);
        
        this.variableName = variableName;
        this.fileName = fileName;
    }
}

module.exports = ImportFileRequire;
