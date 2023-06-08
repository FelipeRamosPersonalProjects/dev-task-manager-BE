const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const RepoTemplate = require('@CLI/templates/Repo');
const ListFileChanges = require('@CLI/components/ListFileChanges');
const BranchTile = require('@CLI/components/tiles/Branch');
const CRUD = require('@CRUD');

async function CommitView() {
    return new ViewCLI({
        name: 'commit',
        poolForm: new PoolForm({
            autoSaveAnswers: true,
            questions: [
                {
                    id: 'isTaskRelated',
                    next: 'chooseRepoFromUser',
                    text: `Is the commit you want to create related to a task? If YES, type the task ID or the task URL. If NO, just hit enter to proceed: `,
                    events: {
                        onAnswer: async (ev, {print, printError}, answer) => {
                            try {
                                if (!answer) {
                                    return await ev.goNext('chooseRepoFromUser');
                                }

                                const task = await CRUD.getDoc({
                                    collectionName: 'tasks',
                                    filter: { $or: [
                                        { taskID: answer },
                                        { taskURL: answer }
                                    ]}
                                }).defaultPopulate();

                                if (task instanceof Error.Log) {
                                    printError(task);
                                    return await ev.trigger();
                                }

                                if (!task) {
                                    print(`The task "${answer}" wasn't found! Please, try again...`, 'TASK-NOT-FOUND');
                                    return await ev.trigger();
                                }

                                return ev.setValue('task', task.initialize());
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                PoolForm.getQuestion('chooseRepoFromUser', {next: 'checkForChanges'}),
                {
                    id: 'checkForChanges',
                    text: `Would you like to prepare your branch to commit (Y/N)? `,
                    next: 'commitDescription',
                    events: {
                        onTrigger: async (ev, {print, printError}) => {
                            try {
                                const task = ev.getValue('task');
                                const repo = ev.getValue('selectedRepo') || ev.setValue('selectedRepo', task && task.repo);

                                if (!repo) {
                                    throw new Error.Log('cli.repos.repo_not_found');
                                }

                                const repoTemplate = new RepoTemplate(repo);
                                repoTemplate.printOnScreen();

                                const currentBranch = await repo.repoManager.getCurrentBranch();
                                if (currentBranch instanceof Error.Log) {
                                    printError(currentBranch);
                                    throw currentBranch;
                                }

                                const currentChanges = await repo.repoManager.currentChanges();
                                if (currentChanges instanceof Error.Log || !currentChanges.success) {
                                    printError(currentChanges);
                                    throw currentChanges;
                                }

                                ev.setValue('currentChanges', currentChanges);
                                if (!currentChanges.changes.length) {
                                    print(`There are no changes to commit!`, 'NO-CHANGES');
                                    return await ev.parentPool.end();
                                }

                                const currentBranchTemplate = new BranchTile({ branchName: currentBranch });
                                const fileChangesTemplate = new ListFileChanges({ fileChanges: currentChanges.changes });

                                currentBranchTemplate.printOnScreen();
                                return fileChangesTemplate.printOnScreen();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        },
                        onAnswer: async (ev, {boolAnswer}, answer) => {
                            try {
                                const repo = ev.getValue('selectedRepo');

                                if (!repo) {
                                    throw new Error.Log('cli.repos.repo_not_found');
                                }

                                if (boolAnswer(answer)) {
                                    const backedUp = await repo.createBranchBackup({ title: 'CommitBackup'});
                                    if (backedUp instanceof Error.Log || !backedUp.success) {
                                        throw backedUp;
                                    }
                                    
                                    const stashed = await repo.repoManager.stashManager.createStash({
                                        type: 'stash-backup',
                                        title: 'CommitBackup',
                                        description: 'This is an auto backup and stash before start commit proceedure!',
                                        backupFolder: backedUp && backedUp.backupFolder
                                    });

                                    if (stashed instanceof Error.Log) {
                                        throw stashed;
                                    }

                                    const appliedBack = await stashed.apply();
                                    if (appliedBack instanceof Error.Log || !appliedBack.success) {
                                        throw appliedBack;
                                    }
                                    
                                    return await ev.goNext();
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                PoolForm.getQuestion('commitDescription', { next: 'commitTitle' }),
                {
                    id: 'commitTitle',
                    text: `Enter your commit title: `,
                    next: 'commitSummary'
                },
                {
                    id: 'commitSummary',
                    text: `Enter your commit summary description: `,
                    next: 'commitChanges'
                },
                {
                    id: 'commitChanges',
                    text: `Do you confirm to commit the current changes (Y/N)?`,
                    next: 'pushCommit',
                    events: {
                        onAnswer: async (ev, {print, printTemplate, boolAnswer}, answer) => {
                            if (!boolAnswer(answer)) {
                                return await ev.parentPool.goToView('home');
                            }

                            try {
                                const repo = ev.getValue('selectedRepo');
                                const commitTitle = ev.getValue('commitTitle');
                                const commitSummary = ev.getValue('commitSummary');
                                const fileChanges = ev.getValue('commitFileChanges');

                                if (!repo) {
                                    throw new Error.Log('cli.repos.repo_not_found');
                                }

                                const commited = await repo.repoManager.commit(commitTitle || '', commitSummary || '', { fileChanges });
                                if (commited instanceof Error.Log || !commited.success) {
                                    throw commited;
                                }

                                printTemplate(commited.commitOutput);
                                print('Commit finished with success!', 'SUCCESS');
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                PoolForm.getQuestion('pushCommit')
            ]
        }, this)
    }, this);
}

module.exports = CommitView;
