const Component = require('@interface/Component');
const DashedHeader = require('@CLI/components/DashedHeader');
const DefaultTile = require('@src/interface/CLI/templates/tiles/DefaultTile');

class TaskTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/Task.md');
    }

    constructor(settings) {
        super(settings);

        const { displayName, taskID, ticketID, ticketURL, project } = new Object(settings || {});

        Object.assign(this, settings);
        this.ticketID = ticketID;
        this.ticketURL = ticketURL;

        this.ProjectTile = new DefaultTile({index: project.cod, displayName: project.displayName});
        this.DashedHeader = new DashedHeader({
            headerText: `[${taskID}] - ${displayName}`,
            headerDescription: 'Check below the task data loaded.'
        });
    }
}

module.exports = TaskTemplate;
