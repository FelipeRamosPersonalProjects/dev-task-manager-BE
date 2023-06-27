const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/spaces.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SingleRelation, MultiRelation, TextAreaEdit } = require('@www/components/DocForm/FormField/fields');

class SpaceEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditSpace.html');
    }

    constructor(settings) {
        super(settings);

        const { users, spaceDoc } = Object(settings);
        const { _id, displayName, spaceName, jiraProject, jiraBaseURL, owner, templates, projects } = Object(spaceDoc);

        this.UID = _id;
        this.collection = spaceDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'space_desks',
            wrapperTag: 'div',
            fields: [
                new InputEdit({
                    fieldName: 'spaceName',
                    label: 'Space Name:',
                    currentValue: spaceName
                }),
                new InputEdit({
                    fieldName: 'jiraProject',
                    label: 'JIRA Project:',
                    currentValue: jiraProject
                }),
                new InputEdit({
                    fieldName: 'jiraBaseURL',
                    label: 'JIRA Base URL:',
                    currentValue: jiraBaseURL
                }),
                new SingleRelation({
                    view: 'read',
                    fieldName: 'owner',
                    label: 'Space Owner:',
                    currentValue: owner,
                    options: users
                }),
                new MultiRelation({
                    view: 'read',
                    fieldName: 'projects',
                    label: 'Projects:',
                    currentValue: projects,
                    options: settings.projects
                }),
                new TextAreaEdit({
                    fieldName: 'templates',
                    label: 'Templates:',
                    currentValue: JSON.stringify(templates)
                })
            ]
        });
    }
}

module.exports = SpaceEdit;
