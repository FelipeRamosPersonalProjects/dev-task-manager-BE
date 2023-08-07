const Component = require('@interface/Component');

class CommitFileChange extends Component {
    get SOURCE_PATH() {
        return require.resolve('./CommitFileChange.html');
    }

    constructor(settings) {
        super(settings);

        const { filename } = Object(settings);

        this.filename = filename;
    }
}

module.exports = CommitFileChange;
