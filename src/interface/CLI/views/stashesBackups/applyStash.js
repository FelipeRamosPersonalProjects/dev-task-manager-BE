const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const ListTilesTemplate = require('@CLI/templates/ListTiles');
const StashTemplate = require('@CLI/templates/Stash');
const StashTile = require('@CLI/components/tiles/StashItem');

async function ApplyStashView({ viewParams, defaultData, dataDoc }) {
    return  new ViewCLI({
        name: 'applyStash',
        poolForm: new PoolForm({
            questions: [
                PoolForm.getQuestion('pickProject'),
                PoolForm.getQuestion('chooseRepo', { next: 'listStashes'}),
                {
                    id: 'listStashes',
                    next: 'confirmStashApply',
                    text: `Choose a stash to apply (Enter the stash index): `,
                    events: {
                        onTrigger: async (ev) => {
                            const repo = ev.getValue('repo');
                            const stashManager = repo && repo.repoManager.stashManager;
                            const stashes = await stashManager.getStash();
                            const listTemplate = new ListTilesTemplate({
                                items: stashes,
                                types: { Tile: StashTile }
                            });

                            listTemplate.printOnScreen();
                            return ev.setValue('stashes', stashes);
                        },
                        onAnswer: async (ev, { print }, answer) => {
                            try {
                                const stashes = ev.getValue('stashes');

                                if (!stashes) {
                                    throw new Error.Log({
                                        name: 'STASH-NOT-FOUND',
                                        message: `Any stash is stored on the PoolForm value "stashes"!`
                                    });
                                }

                                const selectedStash = stashes.find(item => item.stashIndex === answer);
                                const stashTemplate = new StashTemplate(selectedStash);

                                stashTemplate.printOnScreen();
                                return ev.setValue('selectedStash', selectedStash);
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
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
                                        ev.goNext();
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
