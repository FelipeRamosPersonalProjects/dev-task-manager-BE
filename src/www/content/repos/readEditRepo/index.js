const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/tickets.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextArea } = require('@www/components/DocForm/FormField/fields');

class ReadEditRepo extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTicket.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces, ticketDoc, formState } = Object(settings);
        const { status, displayName, externalKey, externalURL, title, description, space, project } = Object(ticketDoc);
        const currentStatus = workflow.getStatus(status);

        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'repos',
            wrapperTag: 'div',
            fields: [
                new SelectInputEdit({
                    fieldName: 'space',
                    label: 'Space:',
                    options: spaces.map(item => ({ label: item.spaceName, value: item._id })),
                    currentValue: space && space.spaceName
                }),
                new SelectInputEdit({
                    fieldName: 'project',
                    label: 'Project:',
                    options: projects.map(item => ({ label: item.projectName, value: item._id })),
                    currentValue: project && project.projectName
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
                })
            ]
        });
    }
}

module.exports = ReadEditRepo;
