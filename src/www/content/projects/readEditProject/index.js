const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/pullrequests.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, TextAreaEdit, SingleRelation, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class ProjectEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditProject.html');
    }

    constructor(settings) {
        super(settings);

        const { projectDoc, spaces } = Object(settings);
        const { _id, displayName, spaceDesk, projectName, projectKey, description, templates, repos } = Object(projectDoc);

        this.UID = _id;
        this.collection = projectDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'projects',
            wrapperTag: 'div',
            fields: [
                new SingleRelation({
                    view: 'read',
                    fieldName: 'spaceDesks',
                    label: 'Space:',
                    currentValue: spaceDesk,
                    options: spaces
                }),
                new InputEdit({
                    view: 'read',
                    fieldName: 'projectName',
                    label: 'Project Name:',
                    currentValue: projectName
                }),
                new InputEdit({
                    view: 'read',
                    fieldName: 'projectKey',
                    label: 'Project Key:',
                    currentValue: projectKey
                }),
                new TextAreaEdit({
                    view: 'read',
                    fieldName: 'description',
                    label: 'Description:',
                    currentValue: description
                }),
                new MultiRelation({
                    view: 'read',
                    fieldName: 'templates',
                    label: 'Templates:',
                    currentValue: templates,
                    options: settings.templates
                }),
                new MultiRelation({
                    view: 'read',
                    fieldName: 'repos',
                    label: 'Repositories:',
                    currentValue: repos,
                    options: settings.repos
                })
            ]
        });
    }
}

module.exports = ProjectEdit;
