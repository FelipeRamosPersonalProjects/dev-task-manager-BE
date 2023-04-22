const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const schemas = require('../../../../schemas');
const CRUD = require('../../../../services/database/crud');

const bodySchema = {
    collectionName: { type: String, required: true }
};

async function CreateView(params) {
    const { defaultData } = params || {};

    const Template = new DashedHeaderLayout({
        componentName: 'CRUD view template',
        headerText: 'Create - CRUD',
        headerDescription: 'Create your documents under collections.'
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
                        schema: bodySchema,
                        defaultData,
                        events: {
                            onEnd: async (ev) => {
                                try {
                                    ev.parent.setValue('docFilter', ev.formData);
                                    return await ev.parent.goNext();
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
                                const filter = ev.parent.getValue('docFilter');

                                if (filter) {
                                    const documentSchema = schemas[filter.collectionName];
                                    documentSchema && ev.setForm(documentSchema.schema.obj);
                                }
                            },
                            onEnd: async (ev) => {
                                ev.view().setValue('newDoc', ev.formData);
                                return await ev.parent.goNext();
                            }
                        }
                    }
                }
            ]
        }
    }, this);
}

module.exports = CreateView;
