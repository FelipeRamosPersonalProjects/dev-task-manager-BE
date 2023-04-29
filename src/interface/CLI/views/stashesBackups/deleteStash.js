const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');

async function DeleteStashView() {
    return new ViewCLI({
        name: 'deleteStash',
        poolForm: new PoolForm({
            questions: [
                PoolForm.getQuestion('pickProject'),
                PoolForm.getQuestion('chooseRepo', { next: 'getStash'}),
                PoolForm.getQuestion('getStash', { next: 'confirmDelete' }),
                {
                    id: 'confirmDelete',
                    text: `Are you sure you want to delete the stash above? It will be permanently deleted! (Y/N): `,
                    events: {
                        onAnswer: async (ev, {print, printTemplate, boolAnswer}, answer) => {
                            try {
                                const stash = ev.getValue('selectedStash');

                                if (stash && boolAnswer(answer)) {
                                    const deleted = await stash.drop();

                                    if (deleted.success) {
                                        console.log('\n');
                                        print(`Stash deleted successfully!`);
                                        printTemplate(deleted.out);
                                    } else {
                                        throw deleted;
                                    }
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                }
            ]
        }, this)
    }, this);
}

module.exports = DeleteStashView;
