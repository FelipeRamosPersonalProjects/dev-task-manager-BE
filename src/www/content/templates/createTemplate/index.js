const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, TextArea, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class TemplateCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTemplate.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, spaces } = Object(settings);

        this.docForm = new DocForm({
            collection: 'templates',
            fields: [
                new MultiRelation({
                    fieldName: 'spaces',
                    label: 'Spaces:',
                    options: spaces
                }),
                new MultiRelation({
                    fieldName: 'projects',
                    label: 'Project:',
                    options: projects
                }),
                new Input({
                    fieldName: 'title',
                    label: 'Title:'
                }),
                new TextArea({
                    fieldName: 'body',
                    label: 'Body:'
                })
            ]
        });
    }
}

module.exports = TemplateCreate;
