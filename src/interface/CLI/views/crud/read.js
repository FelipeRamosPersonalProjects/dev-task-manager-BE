const ViewCLI = require('@CLI/ViewCLI');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const ToolsCLI = require('@CLI/ToolsCLI');
const tools = new ToolsCLI();

const bodySchema = {
    collectionName: {
        type: String,
        required: true
    },
    filter: {
        type: Object,
        required: true
    },
    options: {
        default: {},
        type: {
            paginate: {
                views: { type: Number },
                page: { type: Number },
                seeMore: { type: Boolean }
            },
            select: {
                default: [],
                type: Array
            },
            populate: {
                type: Object
            }
        }
    }
};

async function ReadView(params) {
    const { defaultData } = params || {};

    return new ViewCLI({
        name: 'crud/read',
        Template: new DashedHeaderLayout({
            componentName: 'CRUD view template',
            headerText: 'Read - CRUD',
            headerDescription: `Read you documents' collections.`
        }),
        poolForm: {
            startQuestion: 'read-doc-form',
            events: {
                onStart: (ev) => {
                    tools.print('Starting form "read-doc-form"....\n');
                },
                onEnd: async (ev) => {
                    try {
                        const data = ev.current.formCtrl.formData;
                        await ev.goToView('docDisplay', data);
                    } catch(err) {
                        throw new Error.Log(err);
                    }
                }
            },
            questions: [
                {
                    id: 'read-doc-form',
                    formCtrl: {
                        defaultData,
                        schema: bodySchema,
                        events: {
                            onEnd: async (ev) => {
                                return await ev.parent.goNext();
                            }
                        }
                    }
                }
            ]
        }
    }, this);
}

module.exports = ReadView;
