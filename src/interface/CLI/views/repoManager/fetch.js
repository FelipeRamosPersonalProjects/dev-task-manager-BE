const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const RepoTemplate = require('@CLI/templates/Repo');

async function FetchView() {
    return new ViewCLI({
        name: 'fetch',
        poolForm: new PoolForm({
            questions: [
                PoolForm.getQuestion('chooseRepoFromUser'),
                {
                    id: 'confirmation',
                    text: `Do you confirm to fetch the repository (Y/N)? `,
                    events: {
                        onTrigger: async (ev) => {
                            try {
                                const repo = ev.getValue('selectedRepo');

                                if (!repo) {
                                    throw new Error.Log({
                                        name: 'REPO-NOT-FOUND',
                                        message: `The selected repository wan't found on the pool values!`
                                    });
                                }

                                const repoTemplate = new RepoTemplate(repo);
                                return repoTemplate.printOnScreen();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        },
                        onAnswer: async (ev, {boolAnswer, print, printError, printTemplate}, answer) => {
                            try {
                                const repo = ev.getValue('selectedRepo');

                                if (!repo) {
                                    throw new Error.Log('cli.repos.repo_not_found');
                                }

                                if (boolAnswer(answer)) {
                                    const fetched = await repo.repoManager.fetch();
                                    if (fetched instanceof Error.Log) {
                                        printError(fetched);
                                        return await ev.trigger();
                                    }

                                    if (!fetched.success) {
                                        throw printError(fetched);
                                    } else {
                                        print('Repository fetched with success!', 'SUCCESS');
                                    }

                                    const pulled = await repo.repoManager.pull();
                                    if (pulled instanceof Error.Log) {
                                        printError(pulled);
                                        return await ev.trigger();
                                    }

                                    if (pulled.success) {
                                        if (pulled.out.indexOf('Already up to date') === -1) {
                                            print('Repository pulled with success!', 'SUCCESS');
                                        }

                                        return await ev.goNext();
                                    } else {
                                        throw new Error.Log(pulled);
                                    }
                                } else {
                                    return await ev.goNext();
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

module.exports = FetchView;
