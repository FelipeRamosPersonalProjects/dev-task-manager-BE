const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const ListFileChangesTemplate = require('@CLI/components/ListFileChanges');
const Stash = require('@models/collections/Stash');

async function SaveStashBackupView({ viewParams }) {
    const { isOnlyStash, isOnlyBackup } = new Object(viewParams || {});

    return new ViewCLI({
        name: 'saveStashBackup',
        Template: new DashedHeaderLayout({
            headerText: 'Save Stash and Backup',
            headerDescription: 'Follow the steps below to save a stash of the current changes and the files backup.'
        }),
        poolForm: new PoolForm({
            autoSaveAnswers: true,
            questions: [
                PoolForm.getQuestion('pickProject'),
                PoolForm.getQuestion('chooseRepo'),
                {
                    id: 'stashTitle',
                    text: `Enter a title to identify the stash: `,
                    next: 'stashDescription',
                    events: {
                        onTrigger: async (ev) => {
                            try {
                                const repo = ev.getValue('repo');
                                if (!repo) {
                                    print(`Any repository is stored on "repo" value.`, '[REPO-NOT-FOUND]');
                                    return ev.trigger();
                                }

                                const currentChanges = await repo.repoManager.currentChanges();
                                if (currentChanges instanceof Error.Log) {
                                    throw currentChanges;
                                }

                                if (!currentChanges.success) {
                                    print(`Something went wrong when getting the current changes for the repository "${repo.repoName}"`, '[ERROR-FILE-CHANGES]');
                                    return ev.trigger();
                                }

                                const template = new ListFileChangesTemplate({ fileChanges: currentChanges.changes });
                                
                                return template.printOnScreen();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'stashDescription',
                    text: `Enter a description for the stash: `,
                    next: 'confirmation'
                },
                {
                    id: 'confirmation',
                    text: `Do you confirm to create${!isOnlyBackup ? 'the stash ' : ''}${!isOnlyStash ? ' and the files backup' : ''} (Y/N)? `,
                    events: {
                        onAnswer:  async (ev, {boolAnswer, print}, answer) => {
                            try {
                                const repo = ev.getValue('repo');
                                const stashTitle = ev.getValue('stashTitle');
                                const stashDescription = ev.getValue('stashDescription');
                                let backup;
                                let result;

                                if (boolAnswer(answer)) {
                                    if (!isOnlyStash) {
                                        backup = await repo.createBranchBackup({title: stashTitle});
                                        if (backup instanceof Error.Log) {
                                            throw backup;
                                        }
                                    }

                                    if (!isOnlyBackup) {
                                        result = await repo.repoManager.stashManager.createStash({
                                            type: isOnlyStash && 'stash' || 'stash-backup',
                                            title: stashTitle,
                                            description: stashDescription,
                                            backupFolder: backup && backup.backupFolder
                                        });
    
                                        if (result instanceof Error.Log) {
                                            throw result;
                                        }
                                    } else {
                                        // TODO: This will be part of one of the changes that it's recommneded to do when it's implementing the Backup instance.
                                        result = await Stash.create({
                                            type: 'backup',
                                            title: stashTitle,
                                            description: stashDescription,
                                            backupFolder: backup && backup.backupFolder,
                                            branch: repo && repo.repoManager.getCurrentBranch(),
                                            repo: repo && repo._id
                                        });

                                        if (result instanceof Error.Log) {
                                            throw result;
                                        }
                                    }

                                    if (!result.errors) {
                                        print(`Backup finished successfully!\n`);
                                        print(`Type: ${result.type}`);
                                        print(`Title: ${result.title}`);
                                        print(`Description: ${result.description}`);
                                        print(`Branch: ${result.branch}`);
                                        print(`Repository: ${result.repo ? result.repo.repoName : '--empty--'}`);
                                        print(`Backup file available at: ${result.backupFolder}`);
                                        print(`Intarnal DB document: ${result._id}`);
                                        return ev.goNext();
                                    }
                                } else {
                                    return ev.goNext();
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

module.exports = SaveStashBackupView;
