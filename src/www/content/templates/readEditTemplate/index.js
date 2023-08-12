const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { InputEdit, TextAreaEdit, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class TemplateEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTemplate.html');
    }

    constructor(settings) {
        super(settings);
        
        const { templateDoc, projects, spaces } = Object(settings);

        this.collection = 'templates';
        this.projects = projects;
        this.spaces = spaces;

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
                        title,
                        body,
                        projects,
                        spaces
                    } = Object(templateDoc || this.templateDoc);

                    this.UID = _id;
                    this.displayName = displayName;
                    this.docForm = new DocForm({
                        collection: this.collection,
                        wrapperTag: 'div',
                        fields: [
                            new MultiRelation({
                                view: 'read',
                                fieldName: 'projects',
                                label: 'Projects:',
                                options: this.projects,
                                currentValue: projects
                            }),
                            new MultiRelation({
                                view: 'read',
                                fieldName: 'spaces',
                                label: 'Spaces:',
                                options: this.spaces,
                                currentValue: spaces
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
                                currentValue: body
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
