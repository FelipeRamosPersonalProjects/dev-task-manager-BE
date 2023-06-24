const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/tasks.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextAreaEdit, SingleRelation, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class TaskEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTask.html');
    }

    constructor(settings) {
        super(settings);

        const { taskDoc, repos } = Object(settings);
        const { _id, displayName, taskType, taskVersion, externalKey, externalURL, taskName, description, ticket, project, repo } = Object(taskDoc);

        this.UID = _id;
        this.collection = taskDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'tasks',
            wrapperTag: 'div',
            fields: [
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
                    fieldName: 'taskName',
                    label: 'Task Name:',
                    currentValue: taskName
                }),
                new TextAreaEdit({
                    fieldName: 'description',
                    label: 'Description',
                    currentValue: description
                })
            ]
        });
    }
}

module.exports = TaskEdit;
