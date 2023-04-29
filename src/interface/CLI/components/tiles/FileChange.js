const Component = require('@interface/Component');

class FileChangeComponent extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/FileChange.md');
    }

    constructor(settings) {
        super(settings, {
            filename: { type: String }
        });

        const { filename } = new Object(settings || {});
        
        this.filename = filename;
    }
}

module.exports = FileChangeComponent;
