const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const TaskDocument = require('../components/TaskDocument');
const CRUD = require('../../../services/database/crud');

async function CreatePRsView({ defaultData }) {
    const Template = await new DashedHeaderLayout({
        headerText: 'CREATE A NEW PR',
        headerDescription: `Create a new pull request.`
    }, this).init();

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
                                    return task;
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
                            const Component = await new TaskDocument().init();
                            
                            await Component.printOnScreen(task);
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
                    next: `commitChanges`,
                    text: `Would you like to prepare your final branch before create the PR (Y/N)?`,
                    defaultData,
                    events: {
                        onTrigger: async (ev) => {
                        },
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
                    id: 'commitChanges',
                    defaultData,
                    text: `Do you like to commmit your current changes? (Y/N)?`,
                    next: `savePullRequest`,
                    events: {
                        onTrigger: async (ev, {print}) => {
                            const isReadyToCommit = ev.getValue('isReadyToCommit');
                            if (isReadyToCommit) {
                                print('The branch is ready to commit!');
                            }
                        },
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            onAnswerDefault(ev, answer);
                            const task = ev.getValue('task');

                            if (boolAnswer(answer)) {
                                const isReadyToCommit = ev.getValue('isReadyToCommit');

                                if (isReadyToCommit) {
                                    const isReadyToPR = await task.repo.commitChanges();
                                    if (isReadyToPR instanceof Error.Log) {
                                        isReadyToPR.consolePrint();
                                        return ev.trigger();
                                    }

                                    return ev.setValue('isReadyToPR', isReadyToPR);
                                }
                            }
                        }
                    }
                },
                {
                    id: 'savePullRequest',
                    defaultData,
                    text: `Alright, we are ready to start the PR. Let's build it (Y/N)?`,
                    next: `publishPullRequest`,
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
                    id: 'publishPullRequest',
                    defaultData,
                    text: `So if everithing is ok with the saved pull request, can we proceed and publish it (Y/N)?`,
                    events: {
                        onTrigger: async (ev, {print, printTemplate}) => {
                            const savedPR = ev.getValue('savedPR');
                            if (savedPR) {
                                print('The PR is ready to be published!');
                                printTemplate(savedPR);
                            }
                        },
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            onAnswerDefault(ev, answer);
                            const savedPR = ev.getValue('savedPR');

                            if (boolAnswer(answer)) {
                                const publish = await savedPR.publishPR();
                                if (publish instanceof Error.Log) {
                                    publish.consolePrint();
                                    return ev.trigger();
                                }

                                return ev.setValue('publish', publish);
                            } else {
                                return ev.trigger();
                            }
                        }
                    }
                }
            ],
            events: {
                onEnd: (ev, {printTemplate}) => {
                    const publish = ev.getValue('publish');
                    printTemplate(publish);
                }
            }
        }
    }, this);
}

module.exports = CreatePRsView;

