const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const MainMenuDescription = require('../../components/MainMenuDescription');
const CRUD = require('../../../../services/database/crud');
const ToolsCLI = require('../../ToolsCLI');
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

function ReadView() {
    return new ViewCLI({
        name: 'crud/read',
        Template: new DashedHeaderLayout({
            componentName: 'CRUD view template',
            headerText: 'Read - CRUD',
            description: `Read you documents' collections.`
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
                        const response = await CRUD.getDoc(data);
    
                        tools.print(response.initialize())
                    } catch(err) {
                        debugger;
                        throw new Error.Log(err);
                    }
                }
            },
            questions: [
                {
                    id: 'read-doc-form',
                    formCtrl: {
                        schema: { obj: bodySchema },
                        events: {
                            onEnd: (ev) => {
                                debugger
                            }
                        }
                    }
                }
            ]
        }
    }, this);
}

module.exports = ReadView;
