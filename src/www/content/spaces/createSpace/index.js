const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea, SingleRelation } = require('@www/components/DocForm/FormField/fields');

class CreateSpace extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createSpace.html');
    }

    constructor(settings) {
        super(settings);

        const { jiraProjects } = Object(settings);

        this.docForm = new DocForm({
            collection: 'space_desks',
            fields: [
                new SelectInput({
                    fieldName: 'jiraProject',
                    label: 'JIRA Project:',
                    options: jiraProjects.map(item => ({ label: item.name, value: item.key }))
                }),
                new Input({
                    fieldName: 'spaceName',
                    label: 'Space Name:'
                }),
                new TextArea({
                    fieldName: 'templates',
                    label: 'Templates:'
                })
            ]
        })
    }
}

module.exports = CreateSpace;
