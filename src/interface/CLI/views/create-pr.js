const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const TaskDocument = require('../components/TaskDocument');
const CRUD = require('../../../services/database/crud');
const StringTemplateBuilder = require('@interface/StringTemplateBuilder');

async function CreatePRsView({ defaultData }) {
    const Template = new DashedHeaderLayout({
        headerText: 'CREATE A NEW PR',
        headerDescription: `Create a new pull request.`
    }, this);

    function onAnswerDefault(ev, answer) {
        ev.setValue(ev.id, answer);
    }

    return new ViewCLI({
        name: 'create_pr',
        Template,
        poolForm: {
            startQuestion: 'taskId',
            questions: [
                {
                    id: 'taskId',
                    next: 'autoConfirm',
                    defaultData,
                    text: `Please, enter the task id that you want to create a PR (eg: TASK-4297): `,
                    events: {
                        onAnswer: async (ev, {print}, answer) => {
                            print('Loading the task document from database...\n\n');
                            onAnswerDefault(ev, answer);

                            try {
                                const taskQuery = await CRUD.getDoc({collectionName: 'tasks', filter: {taskID: answer}}).defaultPopulate();
                                if (!taskQuery) {
                                    print(`The task "${answer}" provided, wasn't found! Please try again...`, 'TASK-NOT-FOUND');
                                    return ev.trigger();
                                }
                                
                                const task = taskQuery.initialize();
                                if (task instanceof Error.Log) {
                                    task.consolePrint();
                                    return ev.trigger();
                                }

                                if (task) {
                                    ev.setValue('task', task, true);
                                    return ev;
                                } else {
                                    throw new Error.Log({
                                        name: 'TASK-LOADING-ERROR',
                                        message: `Error caugth on task loading process!`
                                    });
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'autoConfirm',
                    defaultData,
                    text: `Do you want to confirm automatically all steps (Y/N)? `,
                    next: 'prepareBranch',
                    events: {
                        onTrigger: async (ev) => {
                            const task = ev.getValue('task');
                            const Component = new TaskDocument(task);
                            
                            Component.printOnScreen();
                        },
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            try {
                                onAnswerDefault(ev, answer);
                                const task = ev.getValue('task');
    
                                if (boolAnswer(answer)) {
                                    const pullRequest = await task.createPR();
                                    if (pullRequest instanceof Error.Log) {
                                        pullRequest.consolePrint();
                                        return ev.trigger();
                                    }
    
                                    return pullRequest;
                                }
    
                                return;
                            } catch (err) {
                                throw new Error.Log(err).append({
                                    name: 'PR-AUTOCONFIRM',
                                    message: `Error caught during the complete automation PR processs!`
                                });
                            }
                        }
                    }
                },
                {
                    id: 'prepareBranch',
                    next: `commitDescription`,
                    text: `Would you like to prepare your final branch before create the PR (Y/N)?`,
                    defaultData,
                    events: {
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            onAnswerDefault(ev, answer);
                            const task = ev.getValue('task');

                            if (boolAnswer(answer)) {
                                const isReadyToCommit = await task.prepareBranchToPR();
                                if (isReadyToCommit instanceof Error.Log) {
                                    isReadyToCommit.consolePrint();
                                    return ev.trigger();
                                }

                                return ev.setValue('isReadyToCommit', isReadyToCommit);
                            }

                            return ev.setValue('isReadyToCommit', true);
                        }
                    }
                },
                {
                    id: 'commitDescription',
                    next: 'commitChanges',
                    text: `Do you want to add description to the commit files (Y/N)?`,
                    events: {
                        onAnswer: async (event, {boolAnswer}, answer) => {
                            if (boolAnswer(answer)) {
                                const PoolForm = require('../PoolForm');
                                const task = event.getValue('task');

                                const currentChanges = await task.repoManager.currentChanges();
                                if (currentChanges instanceof Error.Log) {
                                    throw currentChanges;
                                }

                                return new Promise(async (resolve, reject) => {
                                    const poolForm = new PoolForm({
                                        events: {
                                            onEnd: async (ev) => {
                                                event.setValue('commitFileChanges', currentChanges.changes);
                                                return resolve(ev);
                                            }
                                        }
                                    }, event);

                                    if (currentChanges && Array.isArray(currentChanges.changes)) {
                                        const changes = currentChanges.changes;

                                        for (let i = 0; i < changes.length; i++) {
                                            const next = ((i + 1) < changes.length) ? String(i + 1) : '';
                                            const id = String(i);
                                            const change = changes[i];

                                            poolForm.setQuestion({
                                                id,
                                                next,
                                                text: new StringTemplateBuilder().newLine()
                                                    .text(change.patch).newLine().newLine()
                                                    .text(`Filepath: ${change.filename}`).newLine().newLine()
                                                    .text('Description: ')
                                                .end(),
                                                events: {
                                                    onAnswer: async (_, __, answer) => {
                                                        change.description = answer;
                                                        return _;
                                                    }
                                                }
                                            });
                                        };
                                    }

                                    await poolForm.start();
                                });
                            }
                        }
                    }
                },
                {
                    id: 'commitChanges',
                    defaultData,
                    text: `Do you like to commmit your current changes? (Y/N)?`,
                    next: `savePullRequest`,
                    events: {
                        onAnswer: async (ev, { boolAnswer, print }, answer) => {
                            onAnswerDefault(ev, answer);
                            const task = ev.getValue('task');
                            const currentChanges = ev.getValue('commitFileChanges');

                            if (boolAnswer(answer)) {
                                const isReadyToCommit = ev.getValue('isReadyToCommit');

                                if (isReadyToCommit) {
                                    print('The branch is ready to commit!');
                                    const isReadyToPR = await task.repo.commitChanges(currentChanges);

                                    if (isReadyToPR instanceof Error.Log) {
                                        isReadyToPR.consolePrint();
                                        return ev.trigger();
                                    }

                                    return ev.setValue('isReadyToPR', isReadyToPR);
                                } else {
                                    return ev.trigger();
                                }
                            }
                        }
                    }
                },
                {
                    id: 'savePullRequest',
                    text: `Alright, we are ready to start the PR. Let's build it (Y/N)?`,
                    next: 'addChangesDescription',
                    defaultData,
                    events: {
                        onTrigger: async (ev, {print}) => {
                            const isReadyToPR = ev.getValue('isReadyToPR');
                            if (isReadyToPR) {
                                print('The commit is ready to PR!');
                            }
                        },
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            onAnswerDefault(ev, answer);
                            const task = ev.getValue('task');

                            if (boolAnswer(answer)) {
                                const savedPR = await task.savePR();
                                if (savedPR instanceof Error.Log) {
                                    savedPR.consolePrint();
                                    return ev.trigger();
                                }

                                return ev.setValue('savedPR', savedPR);
                            }
                        }
                    }
                },
                {
                    id: 'addChangesDescription',
                    text: `Let's start to create the file changes description, can we start (Y/N)? `,
                    next: 'publishPullRequest',
                    events: {
                        onAnswer: async (ev, { boolAnswer, print }, answer) => {
                            const savedPR = ev.getValue('savedPR');
                            if (savedPR instanceof Error.Log) {
                                throw savedPR;
                            }

                            if (!savedPR) {
                                print(`The pull request don't exist on the internal database!`);
                                return ev.trigger();
                            }

                            return new Promise(async (resolve, reject) => {
                                const PoolForm = require('../PoolForm');
                                const newPool = new PoolForm({
                                    events: {
                                        onEnd: async (ev) => {
                                            return resolve(ev);
                                        }
                                    }
                                }, ev);

                                for (let index = 0; index < savedPR.fileChanges.length; index++) {
                                    const change = savedPR.fileChanges[index];
                                    const next = ((index + 1) < savedPR.fileChanges.length) ? String(index + 1) : '';
                                    const id = String(index);
    
                                    newPool.setQuestion({
                                        id,
                                        next,
                                        text: `\n${change.patch}\n\nFilepath: ${change.filename}\nFile blob: ${change.blob_url}\n\nDescription: `,
                                        events: {
                                            onAnswer: async (ev, {}, answer) => {
                                                change.description = answer;
                                                return ev;
                                            }
                                        }
                                    });
                                }

                                await newPool.start();
                            });
                        }
                    }
                },
                {
                    id: 'publishPullRequest',
                    defaultData,
                    next: 'finishing-pr',
                    text: `So if everything is ok with the saved pull request, can we proceed and publish it (Y/N)?`,
                    events: {
                        onTrigger: async (ev, {print, printTemplate}) => {
                            const savedPR = ev.getValue('savedPR');

                            const updated = await savedPR.updateDescription();
                            if (updated instanceof Error.Log) {
                                updated.consolePrint();
                                return ev.trigger();
                            }

                            if (savedPR) {
                                print('The PR is ready to be published!');
                                printTemplate(savedPR);
                            }
                        },
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            onAnswerDefault(ev, answer);
                            const savedPR = ev.getValue('savedPR');

                            if (boolAnswer(answer)) {
                                const published = await savedPR.publishPR();
                                if (published instanceof Error.Log) {
                                    published.consolePrint();
                                    return ev.trigger();
                                }

                                ev.setValue('published', published);
                                return ev.goNext();
                            } else {
                                return ev.trigger();
                            }
                        }
                    }
                },
                {
                    id: 'finishing-pr',
                    text: `Would you like to close dev-desk (Y/N)? `,
                    events: {
                        onAnswer: async (ev) => {
                            return await ev.endParentPool();
                        }
                    }
                }
            ],
            events: {
                onEnd: (ev, {print}) => {
                    const published = ev.values.published || {};

                    print(
                        `The pull request was created, and it's available at the link: ${published.gitHubPR.html_url || '--Link not available--'}\n\n`,
                        'SUCCESS'
                    );
                    return published;
                }
            }
        }
    }, this);
}

module.exports = CreatePRsView;

