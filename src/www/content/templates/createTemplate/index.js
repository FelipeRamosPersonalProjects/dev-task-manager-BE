const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, TextArea, MultiRelation } = require('@www/components/DocForm/FormField/fields');
const TemplateTypeSelector = require('@www/components/TemplateTypeSelector');

class TemplateCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTemplate.html');
    }

    constructor(settings) {
        super(settings);

        const { templates } = Object(settings);

        this.docForm = new DocForm({
            collection: 'templates',
            fields: [
                new TemplateTypeSelector({
                    view: 'create',
                    wrapperTag: 'div',
                    fieldName: 'type',
                    label: 'Template Type:'
                }),
                new Input({
                    fieldName: 'typeID',
                    label: 'Type ID:'
                }),
                new Input({
                    fieldName: 'title',
                    label: 'Title:'
                }),
                new TextArea({
                    fieldName: 'body',
                    label: 'Body:',
                    inputType: 'textarea'
                }),
                new MultiRelation({
                    fieldName: 'typeComponents',
                    label: 'Type Components:',
                    options: templates
                })
            ]
        });
    }
}

module.exports = TemplateCreate;
