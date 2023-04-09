const ToolsCLI = require('../../ToolsCLI');
const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const CRUD = require('../../../../services/database/crud');

const tools = new ToolsCLI();
const bodySchema = {
    collectionName: {
        type: String,
        required: true
    },
    filter: {
        type: Object,
        required: true
    }
};

async function UpdateView(params) {
    const { defaultData } = params || {};

    return new ViewCLI({
        name: 'crud/update',
        Template: await new DashedHeaderLayout({
            headerText: 'Update - CRUD',
            headerDescription: 'Update your documents'
        }).init(),
        poolForm: {
            startQuestion: 'fetching-document',
            events: {
                onEnd: async (ev) => {
                    try {
                        const docFilter = ev.getValue('docFilter');
                        const updates = ev.getValue('updates');

                        await CRUD.update({...docFilter, data: updates});
                    } catch(err) {
                        throw new Error.Log(err);
                    }
                }
            },
            questions: [
                {
                    id: 'fetching-document',
                    next: 'updating-data',
                    formCtrl: {
                        schema: { obj: bodySchema },
                        defaultData,
                        events: {
                            onStart: async (ev) => {
                                tools.print('Starting "fetching-document"');
                            },
                            onEnd: async (ev) => {
                                try {
                                    const currentDoc = await CRUD.getDoc(ev.formData);
                                    
                                    ev.view().setValue('docFilter', ev.formData);
                                    ev.view().setValue('currentDoc', currentDoc.initialize());
                                } catch (err) {
                                    throw new Error.Log(err);
                                }
                            }
                        }
                    }
                },
                {
                    id: 'updating-data',
                    formCtrl: {
                        events: {
                            onStart: async (ev) => {
                                const currentDoc = ev.view().getValue('currentDoc');
                                ev.setForm(currentDoc._schema);
                            },
                            onEnd: async (ev) => {
                                ev.view().setValue('updates', ev.formData);
                            }
                        }
                    }
                }
            ]
        }
    }, this);
}

module.exports = UpdateView;
