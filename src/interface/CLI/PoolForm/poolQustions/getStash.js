const ListTilesTemplate = require('@CLI/templates/ListTiles');
const StashTemplate = require('@CLI/templates/Stash');
const StashTile = require('@CLI/components/tiles/StashItem');

module.exports = {
    id: 'getStash',
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
};
