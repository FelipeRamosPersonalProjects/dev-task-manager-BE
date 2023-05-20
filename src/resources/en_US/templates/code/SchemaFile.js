const Component = require('@interface/Component');

class SchemaFile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/SchemaFile.md');
    }

    constructor(settings) {
        super(settings);

        const { name, key, displayName, pluralLabel, singularLabel } = Object(settings);
        
        this.name = name;
        this.key = key;
        this.displayName = displayName;
        this.pluralLabel = pluralLabel;
        this.singularLabel = singularLabel;
    }
}

module.exports = SchemaFile;
