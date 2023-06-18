const ViewCLI = require('@CLI/ViewCLI');
const TaskTemplate = require('@CLI/templates/Task');
const PoolForm = require('@CLI/PoolForm');
const ViewNavigator = require('@CLI/ViewNavigator');
const CRUD = require('@CRUD');

async function ReadTaskView() {
    const view = new ViewCLI({
        name: 'tasks/readTask',
        poolForm: new PoolForm({
            questions: [{
                id: 'searchParam',
                text: `To open your task, enter the task id, ticket id or task url: `,
                events: {
                    onAnswer: async (ev, _, answer) => {
                        try {
                            const tasks = await CRUD.query({collectionName: 'tasks', filter: { $or: [
                                { externalKey: answer },
                                { externalURL: answer }
                            ]}}).defaultPopulate();

                            const initTasks = tasks.map(task => task.initialize());
                            ev.setValue('docData', initTasks);
                        } catch (err) {
                            throw new Error.Log(err);
                        }
                    }
                }
            }],
            events: {
                onEnd: async (ev) => {
                    try {
                        const tasks = ev.getValue('docData');
                        if (!tasks.length) {
                            throw new Error.Log({
                                name: 'TASK-NOT-FOUND',
                                message: `The task used to create the PR, is not declared!`
                            });
                        }

                        const template = new TaskTemplate(tasks[0]);
                        const taskNav = new ViewNavigator({ options: [
                            {
                                title: 'Create new PR',
                                description: 'Create a new pull request for this task.',
                                targetView: 'create_pr',
                                viewParams: {
                                    task: tasks[0]
                                }
                            }
                        ]}, ev.parent);
    
                        template.printOnScreen();
                        return await taskNav.fire();
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }
        }, this)
    }, this);

    return view;
}

module.exports = ReadTaskView;
