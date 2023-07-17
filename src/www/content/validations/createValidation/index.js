const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea, SingleRelation } = require('@www/components/DocForm/FormField/fields');

class ValidationCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createValidation.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets, pullRequests, tasks, instances } = Object(settings);

        this.docForm = new DocForm({
            collection: 'validations',
            fields: [
                new SelectInput({
                    fieldName: 'instance',
                    label: 'Instance to test:',
                    options: instances
                }),
                new SingleRelation({
                    fieldName: 'ticket',
                    label: 'Parent Ticket:',
                    options: Array.isArray(tickets) && tickets.map(item => ({ _id: item.id, displayName: item.displayName }))
                }),
                new SingleRelation({
                    fieldName: 'task',
                    label: 'Parent Task:',
                    options: Array.isArray(tasks) && tasks.map(item => ({ _id: item.id, displayName: item.displayName }))
                }),
                new SingleRelation({
                    fieldName: 'pullRequest',
                    label: 'Pull Request:',
                    options: pullRequests
                }),
                new Input({
                    fieldName: 'title',
                    label: 'Title:'
                }),
                new TextArea({
                    fieldName: 'description',
                    label: 'Description:'
                }),
                new TextArea({
                    fieldName: 'reportSummary',
                    label: 'Issue Summary:'
                }),
                new TextArea({
                    fieldName: 'conclusion',
                    label: 'Conclusion:'
                })
            ]
        });
    }
}

module.exports = ValidationCreate;
