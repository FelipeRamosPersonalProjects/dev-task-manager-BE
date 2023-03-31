const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const MainMenuDescription = require('../../components/MainMenuDescription');
const schemas = require('../../../../schemas');

function CreateView() {
    const Template = new DashedHeaderLayout({
        componentName: 'CRUD view template',
        headerText: 'Create - CRUD',
        Content: new MainMenuDescription()
    });

    return new ViewCLI({
        name: 'crud/create',
        Template,
        poolForm: {
            startQuestion: 'collectionName',
            questions: [
                {
                    id: 'collectionName',
                    required: true,
                    text: 'Choose a collection to create the document: ',
                    next: 'data',
                    events: {
                        onAnswer: (ev, reply) => {
                            ev.setValue('collectionName', reply);
                            return reply;
                        },
                        onNext: async (ev) => {
                            const collection = schemas[ev.getValue('collectionName')];

                            if (collection) {
                                ev.setValue('schema', collection.schema);
                            }

                            return ev;
                        }
                    }
                },
                {
                    id: 'data',
                    type: 'form-control',
                    next: 'confirmation',
                    text: `Fill the following form sequence to create the document:`,
                    events: {
                        onTrigger: async (ev) => {
                            const schema = ev.getValue('schema');

                            ev.ctrl().setForm(schema);
                            const formData = await ev.ctrl().startPool();
                            ev.setValue('data', formData);
                        }
                    }
                },
                {
                    id: 'confirmation',
                    required: true,
                    text: 'Do you confirm to create the document above? yes (y) no (n): ',
                    events: {
                        onAnswer: async (ev, reply) => {
                            try {
                                const ajaxBody = {
                                    collectionName: ev.getValue('collectionName'),
                                    data: ev.getValue('data')
                                };

                                if (reply === 'y') {
                                    const response = await ajax(process.env.API_SERVER_HOST + '/collection/create', ajaxBody).post();
                                    console.table(response.createdDoc);
                                } else {
                                    console.log('Canceled!');
                                }
                            } catch (err) {
                                debugger
                            }
                        }
                    }
                }
            ],
            events: {
                onEnd: () => {
                    console.log('finished');
                }
            }
        }
    }, this);
}

module.exports = CreateView;
