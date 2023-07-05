const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/tasks.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextAreaEdit, SingleRelation, StatusInput } = require('@www/components/DocForm/FormField/fields');

class TaskEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTask.html');
    }

    constructor(settings) {
        super(settings);

        const { taskDoc, repos } = Object(settings);
        const { _id, status, displayName, taskType, taskVersion, externalKey, externalURL, title, description, ticket, project, repo, discovery } = Object(taskDoc);
        const { findings, rootCauses, solutionSummary } = Object(discovery);

        this.UID = _id;
        this.collection = taskDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'tasks',
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
                        transitionID: item.jiraID,
                        taskType: item.taskType
                    })).filter(item => item.taskType === taskType)
                }),
                new SelectInputEdit({
                    fieldName: 'taskType',
                    label: 'Task Type:',
                    currentValue: taskType,
                    options: [
                        { value: 'DEVELOPEMENT', label: 'Developoment' },
                        { value: 'INVESTIGATION', label: 'Investigation' },
                        { value: 'VALIDATION', label: 'Validation' },
                        { value: 'TODO', label: 'TODO Task' },
                    ]
                }),
                new SingleRelation({
                    view: 'read',
                    fieldName: 'project',
                    label: 'Project:',
                    currentValue: project,
                    options: settings.projects
                }),
                new SingleRelation({
                    view: 'read',
                    fieldName: 'repo',
                    label: 'Repository:',
                    currentValue: repo,
                    options: repos
                }),
                new SingleRelation({
                    view: 'read',
                    fieldName: 'ticket',
                    label: 'Ticket:',
                    currentValue: ticket
                }),
                new InputEdit({
                    fieldName: 'externalKey',
                    label: 'External Key:',
                    currentValue: externalKey
                }),
                new InputEdit({
                    fieldName: 'externalURL',
                    label: 'External URL:',
                    currentValue: externalURL
                }),
                new InputEdit({
                    fieldName: 'taskVersion',
                    label: 'Task Version:',
                    currentValue: taskVersion
                }),
                new InputEdit({
                    fieldName: 'title',
                    label: 'Task Name:',
                    currentValue: title
                }),
                new TextAreaEdit({
                    fieldName: 'description',
                    label: 'Description',
                    currentValue: description
                })
            ]
        });

        if (taskType === 'INVESTIGATION') {
            this.docForm.addFieldTo('fields', new TextAreaEdit({
                fieldName: 'discovery.rootCauses',
                label: 'Root Causes',
                currentValue: rootCauses
            }));

            this.docForm.addFieldTo('fields', new TextAreaEdit({
                fieldName: 'discovery.solutionSummary',
                label: 'Solution Summary',
                currentValue: solutionSummary
            }));
        }
    }
}

module.exports = TaskEdit;
