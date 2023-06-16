const Component = require('@interface/Component');
const SelectInput = require('@www/components/selectInput');

class TicketCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTicket.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces } = Object(settings);

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

module.exports = TicketCreate;
