const ViewCLI = require('@CLI/ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const PullRequestTemplate = require('@CLI/templates/PullRequest');
const StringTemplateBuilder = require('@interface/StringTemplateBuilder');
const FinalTempl = require('@CLI/components/LinksHeaderPR');
const CRUD = require('@CRUD');

async function CreatePRsView({ task }) {
    const Template = new DashedHeaderLayout({
        headerText: 'CREATE A NEW PULL REQUEST',
        headerDescription: `Create a new pull request.`
    }, this);

    function onAnswerDefault(ev, answer) {
        ev.setValue(ev.id, answer);
    }

    async function initializeTaskAndPR(ev, print, taskID) {
        const taskQuery = await CRUD.getDoc({collectionName: 'tasks', filter: {taskID}}).defaultPopulate();
        if (!taskQuery) {
            print(`The task "${taskID}" provided, wasn't found! Please try again...`, 'TASK-NOT-FOUND');
            return ev.trigger();
        }

        const task = taskQuery.initialize();
        if (task instanceof Error.Log) {
            task.consolePrint();
            return ev.trigger();
        }

        if (task) {
            const initPR = await task.dbInitDocPR();
            if (initPR instanceof Error.Log) {
                throw initPR;
            }

            ev.setValue('task', task, true);
            ev.setValue('prDOC', initPR, true);

            if (!initPR.isNewPR) {
                return await ev.goNext('resumeOrRestart');
            } else {
                return {
                    task,
                    initPR
                }
            }
        } else {
            throw new Error.Log({
                name: 'TASK-LOADING-ERROR',
                message: `Error caugth on task loading process!`
            });
        }
    }

    return new ViewCLI({
        name: 'create_pr',
        Template,
        poolForm: {
            startQuestion: task ? 'autoConfirm' : 'taskId',
            questions: [
                {
                    id: 'taskId',
                    next: 'prepareBranch',
                    text: `Please, enter the task id that you want to create a PR (eg: TASK-4297): `,
                    events: {
                        onAnswer: async (ev, {print}, answer) => {
                            print('Loading the task document from database...\n\n');
                            onAnswerDefault(ev, answer);

                            try {
                                const initialized = await initializeTaskAndPR(ev, print, answer);
                                return initialized;
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'resumeOrRestart',
                    text: `You already have the PR above in progress.\nWould you like to continue from where you stopped? (Y/N)? `,
                    next: 'prepareBranch',
                    events: {
                        onTrigger: async (ev) => {
                            const prDOC = ev.getValue('prDOC');
                            const Template = new PullRequestTemplate(prDOC);

                            Template.printOnScreen();
                        },
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            try {
                                onAnswerDefault(ev, answer);
                                const prDOC = ev.getValue('prDOC');

                                if (boolAnswer(answer)) {
                                    switch (prDOC.prStage) {
                                        case 'initialized': {
                                            return ev;
                                        }
                                        case 'branch-created': {
                                            return await ev.goNext('commitDescription');
                                        }
                                        case 'commit-created': {
                                            return await ev.goNext('savePullRequest');
                                        }
                                        case 'compare-filled': {
                                            return await ev.goNext('addChangesDescription');
                                        }
                                        case 'changes-description-filled': {
                                            return await ev.goNext('publishPullRequest');
                                        }
                                    }
                                } else {
                                    return await ev.goNext('deleteInProgress');
                                }
                            } catch (err) {
                                throw new Error.Log(err).append({
                                    name: 'RESUME-PR',
                                    message: `Error caught at the "Resume" or "Restart" in progress PR process!`
                                });
                            }
                        }
                    }
                },
                {
                    id: 'deleteInProgress',
                    next: 'prepareBranch',
                    text: `Would you like to delete the PR in progress before to start a new one (Y/N)?`,
                    events: {
                        onAnswer: async (ev, { boolAnswer, print }, answer) => {
                            const task = ev.getValue('task');
                            const prDOC = ev.getValue('prDOC');

                            try {
                                if (boolAnswer(answer)) {
                                    const deleted = await prDOC.deletePR();
                                    if (deleted instanceof Error.Log) {
                                        throw deleted;
                                    }
                                } else {
                                    const stageChanged = await prDOC.changeStage('aborted');
                                    if (stageChanged instanceof Error.Log) {
                                        throw stageChanged;
                                    }
                                }

                                const initialized = await initializeTaskAndPR(ev, print, task.taskID);
                                return initialized;
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'prepareBranch',
                    next: `commitDescription`,
                    text: `Would you like to prepare your final branch before create the PR (Y/N)?`,
                    events: {
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            onAnswerDefault(ev, answer);
                            const task = ev.getValue('task');
                            const prDOC = ev.getValue('prDOC');

                            if (boolAnswer(answer)) {
                                const isReadyToCommit = await task.prepareBranchToPR();
                                if (isReadyToCommit instanceof Error.Log) {
                                    isReadyToCommit.consolePrint();
                                    return ev.trigger();
                                }

                                const updateStage = await prDOC.changeStage('branch-created');
                                if (updateStage instanceof Error.Log) {
                                    updateStage.consolePrint();
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
                                    });

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
                    text: `Do you like to commmit your current changes? (Y/N)?`,
                    next: `savePullRequest`,
                    events: {
                        onAnswer: async (ev, { boolAnswer, print }, answer) => {
                            onAnswerDefault(ev, answer);
                            const task = ev.getValue('task');
                            const prDOC = ev.getValue('prDOC');
                            const currentChanges = ev.getValue('commitFileChanges');

                            if (boolAnswer(answer)) {
                                const isReadyToCommit = ev.getValue('isReadyToCommit');

                                if (isReadyToCommit.isReady) {
                                    print('The branch is ready to commit!');
                                    const isReadyToPR = await task.repo.commitChanges(currentChanges);

                                    if (isReadyToPR instanceof Error.Log) {
                                        isReadyToPR.consolePrint();
                                        return ev.trigger();
                                    }

                                    const updateStage = await prDOC.changeStage('commit-created');
                                    if (updateStage instanceof Error.Log) {
                                        updateStage.consolePrint();
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
                            const prDOC = ev.getValue('prDOC');

                            if (boolAnswer(answer)) {
                                const savedPR = await task.savePR(prDOC);
                                if (savedPR instanceof Error.Log) {
                                    savedPR.consolePrint();
                                    return ev.trigger();
                                }

                                const updateStage = await savedPR.changeStage('compare-filled');
                                if (updateStage instanceof Error.Log) {
                                    updateStage.consolePrint();
                                    return ev.trigger();
                                }
                                return ev.setValue('prDOC', savedPR);
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
                            if (boolAnswer(answer)) {
                                const savedPR = ev.getValue('prDOC');
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
                    }
                },
                {
                    id: 'publishPullRequest',
                    next: 'finishing-pr',
                    text: `So if everything is ok with the saved pull request, can we proceed and publish it (Y/N)?`,
                    events: {
                        onTrigger: async (ev, {print, printTemplate}) => {
                            const savedPR = ev.getValue('prDOC');

                            if (savedPR.prStage === 'compare-filled') {
                                const updated = await savedPR.updateDescription();
                                if (updated instanceof Error.Log) {
                                    updated.consolePrint();
                                    return ev.trigger();
                                }
    
                                if (savedPR) {
                                    const updateStage = await savedPR.changeStage('changes-description-filled');
                                    if (updateStage instanceof Error.Log) {
                                        updateStage.consolePrint();
                                        return ev.trigger();
                                    }

                                    print('The PR is ready to be published!');
                                    printTemplate(savedPR);
                                }
                            }
                        },
                        onAnswer: async (ev, { boolAnswer }, answer) => {
                            onAnswerDefault(ev, answer);
                            const savedPR = ev.getValue('prDOC');

                            if (boolAnswer(answer)) {
                                const published = await savedPR.publishPR();
                                if (published instanceof Error.Log) {
                                    published.consolePrint();
                                    return ev.trigger();
                                }

                                const updateStage = await savedPR.changeStage('published');
                                if (updateStage instanceof Error.Log) {
                                    updateStage.consolePrint();
                                    return ev.trigger();
                                }

                                ev.setValue('published', published);
                                return ev.goNext();
                            } else {
                                return ev.trigger();
                            }
                        },
                        onEnd: async (ev) => {
                            return await ev.goNext();
                        }
                    }
                }
            ],
            events: {
                onStart: async (ev) => {
                    if (task) {
                        ev.setValue('task', task);
                    }
                },
                onEnd: (ev) => {
                    const published = ev.values.published || {};
                    const task = ev.getValue('task');
                    const comp = new FinalTempl({
                        ticketURL: task.ticketURL,
                        taskURL: task.taskURL,
                        prLink: published.gitHubPR.html_url
                    });

                    comp.printOnScreen();
                    return published;
                }
            }
        }
    }, this);
}

module.exports = CreatePRsView;

