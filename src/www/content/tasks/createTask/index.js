const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, TextArea, SingleRelation } = require('@www/components/DocForm/FormField/fields');

class TaskCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTask.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets } = Object(settings);

        this.docForm = new DocForm({
            collection: 'tasks',
            fields: [
                new SingleRelation({
                    fieldName: 'ticket',
                    label: 'Parent Ticket:',
                    options: tickets
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
                    label: 'Task Name:'
                }),
                new TextArea({
                    fieldName: 'description',
                    label: 'Description:'
                })
            ]
        });
    }
}

module.exports = TaskCreate;
