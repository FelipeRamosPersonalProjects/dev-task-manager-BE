const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');

async function CreateBranchView() {
    return new ViewCLI({
        name: 'createBranch',
        poolForm: new PoolForm({
            autoSaveAnswers: true,
            questions: [
                PoolForm.getQuestion('chooseRepoFromUser', { next: 'baseBranch' }),

                {
                    id: 'baseBranch',
                    next: 'switchToBase',
                    text: `[BASE-BRANCH] What is the base branch to create the new one (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {printError, print}, answer) => {
                            try {
                                const repo = ev.getValue('selectedRepo');
                                if (!repo) {
                                    printError(new Error.Log('cli.repos.repo_not_found'));
                                    return await ev.goNext('chooseRepoFromUser');
                                }

                                const isBranchExist = await repo.repoManager.isBranchExist(answer);

                                if (!isBranchExist.isExist) {
                                    print(`Base branch "${answer}" does not exist! Please try another one...`, '[BASE-NOT-FOUND]');
                                    return await ev.trigger();
                                }

                                return ev.setValue('baseBranchExist', isBranchExist);
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'switchToBase',
                    next: 'checkoutToBase',
                    text: `[SWITCH-BRANCH] Do you want to switch to the base branch (Y/N)? `,
                    events: {
                        onTrigger: async (ev) => {
                            try {
                                const repo = ev.getValue('selectedRepo');
                                const baseBranch = ev.getValue('baseBranch');
                                if (!repo) {
                                    printError(new Error.Log('cli.repos.repo_not_found'));
                                    return await ev.goNext('chooseRepoFromUser');
                                }

                                const currentBranch = repo.repoManager.getCurrentBranch();
                                if (currentBranch === baseBranch) {
                                    ev.setValue('switchToBase', 'n');
                                    return await ev.goNext('bringChanges');
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        },
                        onAnswer: async (ev, {boolAnswer}, answer) => {
                            try {
                                if (!boolAnswer(answer)) {
                                    return await ev.goNext('bringChanges');
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'bringChanges',
                    text: `Would you like to bring the current changes with you (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {}, answer) => {
                            try {
                                const switchToBase = ev.getValue('switchToBase');

                                if (!switchToBase || switchToBase === 'n') {
                                    return await ev.goNext('branchName');
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'checkoutToBase',
                    next: 'branchName',
                    text: `Would you confirm to checkout to base branch (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {boolAnswer, print}, answer) => {
                            try {
                                const repo = ev.getValue('selectedRepo');
                                const baseBranch = ev.getValue('baseBranch');
                                const bringChanges = boolAnswer(answer);

                                if (!repo) {
                                    printError(new Error.Log('cli.repos.repo_not_found'));
                                    return await ev.goNext('chooseRepoFromUser');
                                }

                                const checked = await repo.repoManager.checkout(baseBranch, { bringChanges });
                                if (checked instanceof Error.Log) {
                                    throw checked;
                                }

                                ev.setValue('bringChanges', bringChanges);
                                print(`Branch switched with success!`, 'SUCCESS');
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'branchName',
                    text: `[BRANCH-NAME] What is the name for the new branch (Y/N)? `,
                    next: 'confirmCreateBranch',
                    events: {
                        onAnswer: async (ev, {}, answer) => {
                            try {
                                const repo = ev.getValue('selectedRepo');
                                if (!repo) {
                                    printError(new Error.Log('cli.repos.repo_not_found'));
                                    return await ev.goNext('chooseRepoFromUser');
                                }

                                const isBranchExist = await repo.repoManager.isBranchExist(answer);
                                if (isBranchExist.isExist) {
                                    print(`Branch name "${answer}" already exist! Please try another one...`, '[DUPLICATED-NAME]');
                                    return await ev.trigger();
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'confirmCreateBranch',
                    text: `[CONFIRM] Do you confirm to create the new branch (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {print, printError}, answer) => {
                            try {
                                const repo = ev.getValue('selectedRepo');
                                const branchName = ev.getValue('branchName');
                                const baseBranch = ev.getValue('baseBranch');
                                const bringChanges = ev.getValue('bringChanges');

                                if (!repo) {
                                    printError(new Error.Log('cli.repos.repo_not_found'));
                                    return await ev.goNext('chooseRepoFromUser');
                                }

                                const checked = await repo.repoManager.createBranch(branchName, baseBranch, { bringChanges });
                                if (!checked || checked instanceof Error.Log) {
                                    throw checked;
                                }

                                print(`Branch switched with success!`, 'SUCCESS');
                                return await ev.redirectTo();
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

module.exports = CreateBranchView;
