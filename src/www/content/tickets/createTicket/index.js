const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SingleRelation, TextArea } = require('@www/components/DocForm/FormField/fields');

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
                new SingleRelation({
                    fieldName: 'space',
                    label: 'Space:',
                    options: spaces
                }),
                new SingleRelation({
                    fieldName: 'project',
                    label: 'Project:',
                    options: projects
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
