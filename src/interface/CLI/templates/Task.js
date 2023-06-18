const Component = require('@interface/Component');
const DashedHeader = require('@CLI/components/DashedHeader');
const DefaultTile = require('@CLI/components/tiles/DefaultTile');

class TaskTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/Task.md');
    }

    constructor(settings) {
        super(settings);

        const { displayName, externalKey, externalKey, externalURL, project } = new Object(settings || {});

        Object.assign(this, settings);
        this.externalKey = externalKey;
        this.externalURL = externalURL;

        this.ProjectTile = new DefaultTile({index: project.cod, displayName: project.displayName});
        this.DashedHeader = new DashedHeader({
            headerText: `[${externalKey}] - ${displayName}`,
            headerDescription: 'Check below the task data loaded.'
        });
    }
}

module.exports = TaskTemplate;
