const ListTiles = require('@CLI/templates/ListTiles');
const CRUD = require('@CRUD');
const RepoTemplate = require('@CLI/templates/Repo');
const User = require('@models/collections/User');

module.exports = {
    id: 'chooseRepoFromUser',
    next: 'confirmation',
    text: `Type one of the index above to choose a repository to manage: `,
    events: {
        onTrigger: async (ev) => {
            try {
                let repos = await CRUD.query({
                    collectionName: 'repos',
                    filter: { $or: [
                        { owner: User.currentUser() },
                        { collaborators: { $in: [User.currentUser()] } }
                    ]}
                }).defaultPopulate();

                repos = repos.map(item => item.initialize());
                const listTemplate = new ListTiles({
                    items: repos.map(item => {
                        item.index = String(item.index);
                        return item;
                    })
                });

                ev.setValue('repos', repos);
                return listTemplate.printOnScreen();
            } catch (err) {
                throw new Error.Log(err);
            }
        },
        onAnswer: async (ev, {print}, answer) => {
            try {
                const repos = ev.getValue('repos');
                const selectedRepo = repos.find(item => String(item.index) === answer);
                if (!selectedRepo) {
                    print(`The choosed option "${answer}" isn't valid! Try again...`);
                    return await ev.trigger();
                }

                const repoTemplate = new RepoTemplate(selectedRepo);
                repoTemplate.printOnScreen();
                ev.setValue('selectedRepo', selectedRepo);
            } catch (err) {
                throw new Error.Log(err);
            }
        }
    }
};
