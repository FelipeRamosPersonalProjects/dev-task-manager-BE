const Component = require('@interface/Component');
const SelectInput = require('@www/components/selectInput');
const workflow = require('@CONFIGS/workflows/tickets.workflow');

class TicketEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTicket.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces, ticketDoc, formState } = Object(settings);
        const { status, displayName, externalKey, externalURL, title, description } = Object(ticketDoc);
        const currentStatus = workflow.getStatus(status);

        this.displayName = displayName;
        this.externalKey = externalKey;
        this.externalURL = externalURL;
        this.title = title;
        this.description = description;
        this.currentStatus = currentStatus && currentStatus.displayName.toUpperCase() || '';
        this.status = new SelectInput({
            fieldName: 'status',
            selectState: formState === 'read' ? 'edit' : 'read',
            currentValue: currentStatus && currentStatus.statusID || '',
            options: workflow.statuses.map(item => ({
                label: item.displayName.toUpperCase(),
                value: item.statusID
            }))
        }).renderToString();
        this.spaces = new SelectInput({
            fieldName: 'space',
            options: spaces.map(item => ({ label: item.spaceName, value: item._id }))
        }).renderToString();
        this.projects = new SelectInput({
            fieldName: 'project',
            options: projects.map(item => ({ label: item.projectName, value: item._id }))
        }).renderToString();
    }
}

module.exports = TicketEdit;
