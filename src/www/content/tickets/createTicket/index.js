const Component = require('@interface/Component');
const SelectInput = require('@www/components/selectInput');

class TicketCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTicket.html');
    }

    constructor(settings) {
        super(settings);

        const { fieldName, projects } = Object(settings);

        this.projects = new SelectInput({
            fieldName,
            options: projects.map(item => ({ label: item.projectName, value: item._id }))
        }).renderToString();
    }
}

module.exports = TicketCreate;
