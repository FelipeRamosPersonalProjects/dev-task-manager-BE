const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { InputEdit, TextAreaEdit, MultiRelation } = require('@www/components/DocForm/FormField/fields');
const TemplateTypeSelector = require('@src/www/components/TemplateTypeSelector');

class TemplateEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTemplate.html');
    }

    constructor(settings) {
        super(settings);
        
        const { templateDoc, typeComponents } = Object(settings);

        this.collection = 'templates';
        this.typeComponents = typeComponents;

        this.setters.templateDoc(templateDoc);
    }

    get setters() {
        return {
            templateDoc: (templateDoc) => {
                if (templateDoc) {
                    this.templateDoc = templateDoc;
                }

                if (this.templateDoc) {
                    const {
                        _id,
                        displayName,
                        type,
                        typeID,
                        title,
                        body,
                        typeComponents
                    } = Object(templateDoc || this.templateDoc);

                    this.UID = _id;
                    this.displayName = displayName;
                    this.docForm = new DocForm({
                        collection: this.collection,
                        wrapperTag: 'div',
                        fields: [
                            new TemplateTypeSelector({
                                view: 'read',
                                fieldName: 'type',
                                label: 'Template Type:',
                                currentValue: type
                            }),
                            new InputEdit({
                                view: 'read',
                                fieldName: 'typeID',
                                label: 'Type ID:',
                                currentValue: typeID
                            }),
                            new InputEdit({
                                view: 'read',
                                fieldName: 'title',
                                label: 'Title:',
                                currentValue: title
                            }),
                            new TextAreaEdit({
                                view: 'read',
                                fieldName: 'body',
                                label: 'Body:',
                                inputType: 'textarea',
                                currentValue: body
                            }),
                            new MultiRelation({
                                view: 'read',
                                fieldName: 'typeComponents',
                                label: 'Type Components:',
                                options: this.typeComponents,
                                currentValue: typeComponents
                            })
                        ]
                    });
                }
            }
        };
    }

    async load() {
        try {
            await this.loadDependencies();
            this.setters.templateDoc();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = TemplateEdit;
