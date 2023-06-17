const Component = require('@interface/Component');
const SelectInput = require('@www/components/selectInput');

class TicketEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTicket.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces, ticketDoc } = Object(settings);
        const { displayName, ticketID, ticketURL, title, description } = Object(ticketDoc);

        this.displayName = displayName;
        this.ticketID = ticketID;
        this.ticketURL = ticketURL;
        this.title = title;
        this.description = description;
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
