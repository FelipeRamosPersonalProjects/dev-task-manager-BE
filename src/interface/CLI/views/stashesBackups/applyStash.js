const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');

async function ApplyStashView() {
    return new ViewCLI({
        name: 'applyStash',
        poolForm: new PoolForm({
            questions: [
                PoolForm.getQuestion('pickProject'),
                PoolForm.getQuestion('chooseRepo', { next: 'getStash'}),
                PoolForm.getQuestion('getStash', { next: 'confirmStashApply' }),
                {
                    id: 'confirmStashApply',
                    text: `Do you confirm to apply the stash above displayed (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {printTemplate, boolAnswer}, answer) => {
                            try {
                                const selectedStash = ev.getValue('selectedStash');

                                if (selectedStash && boolAnswer(answer)) {
                                    const applied = await selectedStash.apply();
                                    
                                    if (applied.success) {
                                        printTemplate(applied.out);
                                        return await ev.goNext();
                                    } else {
                                        throw applied;
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

module.exports = ApplyStashView;
