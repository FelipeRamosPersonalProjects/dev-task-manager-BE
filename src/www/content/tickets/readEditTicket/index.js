const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/tickets.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextAreaEdit, SingleRelation, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class TicketEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTicket.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces, projectTasks, ticketDoc } = Object(settings);
        const { _id, status, displayName, externalKey, externalURL, title, description, space, project, tasks } = Object(ticketDoc);
        const currentStatus = workflow.getStatus(status);

        this.UID = _id;
        this.collection = ticketDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'tickets',
            wrapperTag: 'div',
            fields: [
                new SelectInputEdit({
                    label: 'Status:',
                    fieldName: 'status',
                    view: 'read',
                    currentValue: currentStatus && currentStatus.statusID || '',
                    options: workflow.statuses.map(item => ({
                        label: item.displayName.toUpperCase(),
                        value: item.statusID
                    }))
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
                    fieldName: 'title',
                    label: 'Ticket Title:',
                    currentValue: title
                }),
                new TextAreaEdit({
                    fieldName: 'description',
                    label: 'Description:',
                    currentValue: description
                }),
                new SingleRelation({
                    view: 'read',
                    fieldName: 'space',
                    label: 'Space:',
                    options: spaces,
                    currentValue: space
                }),
                new SingleRelation({
                    view: 'read',
                    fieldName: 'project',
                    label: 'Project:',
                    options: projects,
                    currentValue: project
                }),
                new MultiRelation({
                    view: 'read',
                    fieldName: 'tasks',
                    label: 'Tasks:',
                    options: projectTasks || [],
                    currentValue: tasks
                })
            ]
        });
    }
}

module.exports = TicketEdit;
