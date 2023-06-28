const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SingleRelation, SelectInput } = require('@www/components/DocForm/FormField/fields');

class EstimationCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createEstimation.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets, tasks } = Object(settings);

        this.docForm = new DocForm({
            collection: 'estimations',
            fields: [
                new SelectInput({
                    fieldName: 'type',
                    label: 'Estimation Type:',
                    options: [
                        { label: 'Development', value: 'DEV' },
                        { label: 'Changes Requested', value: 'CR' }
                    ]
                }),
                new SelectInput({
                    fieldName: 'unit',
                    label: 'Time Unit:',
                    options: [
                        { label: 'Minute', value: 'MINUTE' },
                        { label: 'Hour', value: 'HOUR' },
                        { label: 'Day', value: 'DAY' },
                        { label: 'Week', value: 'WEEK' },
                        { label: 'Month', value: 'MONTH' },
                        { label: 'Year', value: 'YEAR' }
                    ]
                }),
                new Input({
                    fieldName: 'FE',
                    inputType: 'number',
                    label: 'Frontend:'
                }),
                new Input({
                    fieldName: 'BE',
                    inputType: 'number',
                    label: 'Backend:'
                }),
                new Input({
                    fieldName: 'QA',
                    inputType: 'number',
                    label: 'Quality Assurance:'
                }),
                new Input({
                    fieldName: 'others',
                    inputType: 'number',
                    label: 'Other Estimations:'
                }),
                new SingleRelation({
                    fieldName: 'ticket',
                    label: 'Parent Ticket:',
                    options: tickets
                }),
                new SingleRelation({
                    fieldName: 'task',
                    label: 'Parent Task:',
                    options: tasks
                })
            ]
        });
    }
}

module.exports = EstimationCreate;
