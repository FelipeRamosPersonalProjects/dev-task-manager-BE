const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const CRUD = require('../../../../services/database/crud');

const bodySchema = {
    collectionName: { type: String, required: true },
    filter: { type: Object, required: true }
};

async function RemoveView() {
    return new ViewCLI({
        name: 'crud/remove',
        Template: new DashedHeaderLayout({
            headerText: 'Delete - CRUD',
            description: 'Delete your document under your collections.'
        }),
        poolForm: {
            startQuestion: 'delete-form',
            events: {
                onEnd: async (ev) => {
                    console.log('>>>> Finished the pool!');
                }
            },
            questions: [
                {
                    id: 'delete-form',
                    next: 'confirmation',
                    formCtrl: {
                        schema: bodySchema,
                        events: {
                            onEnd: async (ev) => {
                                ev.view().setValue('deleteFilter', ev.formData);
                            }
                        }
                    }
                },
                {
                    id: 'confirmation',
                    text: `Are you sure that you want to delete this document?\n>> (y) or (n): `,
                    events: {
                        onAnswer: async (ev, _, answer) => {
                            const deleteFilter = ev.ctrl().getValue('deleteFilter');

                            if (answer === 'y') {
                                const deleted = await CRUD.del(deleteFilter);
                                
                                if (!deleted.acknowledged) {
                                    this.triggerEvent('error', this);
                                }
                            } else {
                                process.kill();
                            }
                        }
                    }
                }
            ]
        }
    }, this);
}

module.exports = RemoveView;
