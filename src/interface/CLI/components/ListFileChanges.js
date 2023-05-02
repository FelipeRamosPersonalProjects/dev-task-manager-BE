const Component = require('@interface/Component');
const FileChange = require('@CLI/components/tiles/FileChange');

class ListFileChangesTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ListFileChanges.md');
    }

    constructor(settings) {
        super(settings);
        const { fileChanges } = Object(settings);
        
        this.fileChanges = fileChanges;
        this.types = {
            FileChange
        }
    }
}

module.exports = ListFileChangesTemplate;
