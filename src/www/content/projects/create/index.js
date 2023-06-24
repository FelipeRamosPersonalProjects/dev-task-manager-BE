const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea, SingleRelation } = require('@www/components/DocForm/FormField/fields');

class ProjectCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./create.html');
    }

    constructor(settings) {
        super(settings);

        const { spaces } = Object(settings);

        this.docForm = new DocForm({
            collection: 'projects',
            fields: [
                new SingleRelation({
                    fieldName: 'spaceDesk',
                    label: 'Project Space:',
                    options: spaces
                }),
                new Input({
                    fieldName: 'projectKey',
                    label: 'Project Key:'
                }),
                new Input({
                    fieldName: 'projectName',
                    label: 'Project Name:'
                }),
                new TextArea({
                    fieldName: 'description',
                    label: 'Description:'
                }),
                new TextArea({
                    fieldName: 'templates',
                    label: 'Templates:'
                })
            ]
        });
    }
}

module.exports = ProjectCreate;
