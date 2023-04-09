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
                        onAnswer: async (ev, answer) => {
                            ev.tools.print('Loading the task document from database...');
                            onAnswerDefault(ev, answer);

                            try {
                                const task = await CRUD.getDoc({collectionName: 'tasks', filter: {taskID: answer}}).defaultPopulate().initialize();
                                if (task instanceof Error.Log) {
                                    throw task;
                                }

                                if (task) {
                                    ev.setValue('task', task, true);
                                    return task;
                                }

                                console.log(`\n`);
                                ev.tools.print(`The task "${answer}" wasn't found!`);
                                ev.tools.print(`Please try again...\n\n`);
                                return ev.trigger();
                            } catch (err) {
                                ev.events.triggerEvent('error', ev);
                            }
                        }
                    }
                },
                {
                    id: 'autoConfirm',
                    defaultData,
                    text: `Do you want to confirm automatically all steps (Y/N)? `,
                    events: {
                        onTrigger: async (ev) => {
                            const task = ev.getValue('task');
                            const Component = await new TaskDocument().init(task)
                            
                            await Component.printOnScreen(task);
                        },
                        onAnswer: async (ev, answer) => {
                            onAnswerDefault(ev, answer);
                            const task = ev.getValue('task');

                            if (answer.toLowerCase() === 'y') {
                                const pullRequest = await task.createPR();
                                if (pullRequest instanceof Error.Log) {
                                    throw pullRequest;
                                }

                                return pullRequest;
                            } else {

                                debugger;
                            }
                        }
                    }
                }
            ],
            events: {
                onEnd: (ev) => {
                    debugger;
                }
            }
        }
    }, this);
}

module.exports = CreatePRsView;

