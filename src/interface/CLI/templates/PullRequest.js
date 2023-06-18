const Component = require('@interface/Component');
const DashedHeader = require('@CLI/components/DashedHeader');
const DefaultFileChangeTemplate = require('@src/resources/en_US/templates/default_file_change');

class PullRequestTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/PullRequest.md');
    }

    constructor(settings) {
        super(settings);
        const { displayName, name, summary, externalKey, externalKey, base, head, fileChanges } = settings || {};
        
        this.displayName = displayName;
        this.name = name;
        this.base = base;
        this.head = head;
        this.externalKey = externalKey;
        this.externalKey = externalKey;
        this.fileChanges = fileChanges;

        this.Header = new DashedHeader({
            headerText: displayName,
            headerDescription: summary
        });
        this.types = {
            Change: DefaultFileChangeTemplate
        };
    }
}

module.exports = PullRequestTemplate;
