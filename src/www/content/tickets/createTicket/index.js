const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea } = require('@www/components/DocForm/FormField/fields');

class TicketCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTicket.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces } = Object(settings);

        this.docForm = new DocForm({
            collection: 'tickets',
            fields: [
                new SelectInput({
                    fieldName: 'space',
                    label: 'Space:',
                    options: spaces.map(item => ({ label: item.spaceName, value: item._id }))
                }),
                new SelectInput({
                    fieldName: 'project',
                    label: 'Project:',
                    options: projects.map(item => ({ label: item.projectName, value: item._id }))
                }),
                new Input({
                    fieldName: 'externalKey',
                    label: 'External Key:'
                }),
                new Input({
                    fieldName: 'externalURL',
                    label: 'External URL:'
                }),
                new Input({
                    fieldName: 'title',
                    label: 'Ticket Title:'
                }),
                new TextArea({
                    fieldName: 'description',
                    label: 'Description:'
                })
            ]
        });
    }
}

module.exports = TicketCreate;
