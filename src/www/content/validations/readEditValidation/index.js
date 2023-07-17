const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/validations.workflow');
const DocForm = require('@www/components/DocForm');
const { StatusInput, InputEdit, SelectInputEdit, TextAreaEdit, SingleRelation } = require('@www/components/DocForm/FormField/fields');

class ValidationEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditValidation.html');
    }

    constructor(settings) {
        super(settings);

        const { validationDoc, instances, pullRequests, tickets, tasks } = Object(settings);
        const { _id, displayName, status, instance, ticket, pullRequest, title, description, reportSummary, conclusion } = Object(validationDoc);
        const currentStatus = workflow.getStatus(status);

        this.UID = _id;
        this.collection = validationDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'validations',
            wrapperTag: 'div',
            fields: [
                new StatusInput({
                    label: 'Status:',
                    fieldName: 'status',
                    view: 'read',
                    currentValue: Object(currentStatus),
                    options: workflow.statuses.map(item => ({
                        collection: this.collection,
                        docUID: this.UID,
                        displayName: item.displayName.toUpperCase(),
                        statusID: item.statusID,
                        transitionID: item.jiraID
                    }))
                }),
                new SelectInputEdit({
                    fieldName: 'instance',
                    label: 'Instance to Test:',
                    options: instances,
                    currentValue: instance
                }),
                new SingleRelation({
                    fieldName: 'ticket',
                    label: 'Parent Ticket:',
                    currentValue: Object(ticket)._id,
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
                    currentValue: Object(pullRequest)._id,
                    options: Array.isArray(pullRequests) && pullRequests.map(item => ({ _id: item.id, displayName: item.displayName }))
                }),
                new InputEdit({
                    fieldName: 'title',
                    label: 'Title:',
                    currentValue: title
                }),
                new TextAreaEdit({
                    fieldName: 'description',
                    label: 'Description:',
                    currentValue: description
                }),
                new TextAreaEdit({
                    fieldName: 'reportSummary',
                    label: 'Issue Summary:',
                    currentValue: reportSummary
                }),
                new TextAreaEdit({
                    fieldName: 'conclusion',
                    label: 'Conclusion:',
                    currentValue: conclusion
                })
            ]
        });
    }
}

module.exports = ValidationEdit;
