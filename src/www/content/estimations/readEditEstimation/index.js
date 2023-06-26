const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/estimations.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextAreaEdit, SingleRelation, StatusInput } = require('@www/components/DocForm/FormField/fields');

class EstimationEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditEstimation.html');
    }

    constructor(settings) {
        super(settings);

        const { estimationDoc, tickets, tasks } = Object(settings);
        const { _id, status, type, unit, displayName, title, description, ticket, task } = Object(estimationDoc);
        let parsedTime = Object(estimationDoc.parsedTime);

        this.UID = _id;
        this.collection = estimationDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'estimations',
            wrapperTag: 'div',
            fields: [
                new StatusInput({
                    label: 'Status:',
                    fieldName: 'status',
                    view: 'read',
                    currentValue: Object(workflow.getStatus(status)),
                    options: workflow.statuses.map(item => ({
                        collection: this.collection,
                        docUID: this.UID,
                        displayName: item.displayName.toUpperCase(),
                        statusID: item.statusID,
                        transitionID: item.jiraID
                    }))
                }),
                new SelectInputEdit({
                    fieldName: 'type',
                    view: 'read',
                    label: 'Estimation Type:',
                    currentValue: type,
                    options: [
                        { label: 'Development', value: 'DEV' },
                        { label: 'Changes Requested', value: 'CR' }
                    ]
                }),
                new SelectInputEdit({
                    fieldName: 'unit',
                    view: 'read',
                    label: 'Time Unit:',
                    currentValue: unit,
                    options: [
                        { label: 'Minute', value: 'MINUTE' },
                        { label: 'Hour', value: 'HOUR' },
                        { label: 'Day', value: 'DAY' },
                        { label: 'Week', value: 'WEEK' },
                        { label: 'Month', value: 'MONTH' },
                        { label: 'Year', value: 'YEAR' }
                    ]
                }),
                new InputEdit({
                    fieldName: 'title',
                    view: 'read',
                    label: 'Title:',
                    currentValue: title
                }),
                new InputEdit({
                    fieldName: 'FE',
                    view: 'read',
                    inputType: 'number',
                    label: 'Frontend:',
                    currentValue: parsedTime.FE
                }),
                new InputEdit({
                    fieldName: 'BE',
                    view: 'read',
                    inputType: 'number',
                    label: 'Backend:',
                    currentValue: parsedTime.BE
                }),
                new InputEdit({
                    fieldName: 'QA',
                    view: 'read',
                    inputType: 'number',
                    label: 'Quality Assurance:',
                    currentValue: parsedTime.QA
                }),
                new InputEdit({
                    fieldName: 'others',
                    view: 'read',
                    inputType: 'number',
                    label: 'Other Estimations:',
                    currentValue: parsedTime.others
                }),
                new TextAreaEdit({
                    fieldName: 'description',
                    view: 'read',
                    label: 'Description:',
                    currentValue: description
                }),
                new SingleRelation({
                    fieldName: 'ticket',
                    view: 'read',
                    label: 'Parent Ticket:',
                    currentValue: ticket,
                    options: tickets
                }),
                new SingleRelation({
                    fieldName: 'task',
                    view: 'read',
                    label: 'Parent Task:',
                    currentValue: task,
                    options: tasks
                })
            ]
        });
    }
}

module.exports = EstimationEdit;
