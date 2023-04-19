const ViewCLI = require('@CLI/ViewCLI');
const TaskTemplate = require('@CLI/templates/Task');
const PoolForm = require('@interface/CLI/PoolForm');
const CRUD = require('@CRUD');

async function ReadTaskView() {
    return new ViewCLI({
        name: 'tasks/readTask',
        poolForm: new PoolForm({
            questions: [{
                id: 'searchParam',
                text: `To open your task, enter the task id, ticket id or task url: `,
                events: {
                    onAnswer: async (ev, {}, answer) => {
                        try {
                            const tasks = await CRUD.query({collectionName: 'tasks', filter: { $or: [
                                { taskID: answer },
                                { taskURL: answer }
                            ]}}).defaultPopulate();

                            const initTasks = tasks.map(tesk => tesk.initialize());

                            ev.setValue('docData', initTasks);
                            return ev.endParentPool();
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
                        const template = new TaskTemplate(tasks[0]);
    
                        template.printOnScreen();
                    } catch (err) {
                        debugger;
                    }
                }
            }
        }, this)
    }, this);
}

module.exports = ReadTaskView;
