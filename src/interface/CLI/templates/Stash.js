const Component = require('@interface/Component');
const DashedHeader = require('@CLI/components/DashedHeader');

class StashTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/Stash.md');
    }

    constructor(settings) {
        super(settings, {
            displayName: { type: String },
            description: { type: String }
        });

        const { displayName, description, createdAt, type, stashIndex, gitName, branch, backupFolder } = new Object(settings || {});
        
        this.header = new DashedHeader({
            headerText: `📰  ${displayName.toUpperCase()}`,
            headerDescription: description
        });

        this.displayName = displayName;
        this.description = description;
        this.createdAt = createdAt;
        this.type = type;
        this.stashIndex = stashIndex;
        this.gitName = gitName;
        this.branch = branch;
        this.backupFolder = backupFolder;
    }
}

module.exports = StashTemplate;
