const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const MainMenuDescription = require('../../components/MainMenuDescription');
const ToolsCLI = require('../../ToolsCLI');
const schemas = require('../../../../schemas');
const CRUD = require('../../../../services/database/crud');

const tools = new ToolsCLI();
const bodySchema = {
    collectionName: { type: String, required: true },
    data: { type: Object, required: true },
    options: { type: Object, default: {} }
};

function CreateView() {
    const Template = new DashedHeaderLayout({
        componentName: 'CRUD view template',
        headerText: 'Create - CRUD',
        headerDescription: 'Create your documents under collections.',
        Content: new MainMenuDescription()
    });

    return new ViewCLI({
        name: 'crud/create',
        Template,
        poolForm: {
            startQuestion: 'build-params',
            events: {
                onEnd: async (ev) => {
                    try {
                        const docFilter = ev.getValue('docFilter');
                        const newDoc = ev.getValue('newDoc');

                        const created = await CRUD.create(docFilter.collectionName, newDoc);

                        ev.view().print('Document created successfully!');
                        return created;
                    } catch(err) {
                        throw new Error.Log(err);
                    }
                }
            },
            questions: [
                {
                    id: 'build-params',
                    next: 'collecting-data',
                    formCtrl: {
                        schema: { obj: bodySchema },
                        events: {
                            onStart: async (ev) => {
                                tools.print('Starting "build-params"...');
                            },
                            onEnd: async (ev) => {
                                try {
                                    ev.view().setValue('docFilter', ev.formData);
                                } catch (err) {
                                    throw new Error.Log(err);
                                }
                            }
                        }
                    }
                },
                {
                    id: 'collecting-data',
                    formCtrl: {
                        events: {
                            onStart: async (ev) => {
                                const filter = ev.view().getValue('docFilter');

                                if (filter) {
                                    const documentSchema = schemas[filter.collectionName];
                                    documentSchema && ev.setForm(documentSchema.schema);
                                }
                            },
                            onEnd: async (ev) => {
                                ev.view().setValue('newDoc', ev.formData);
                            }
                        }
                    }
                }
            ]
        }
    }, this);
}

module.exports = CreateView;
