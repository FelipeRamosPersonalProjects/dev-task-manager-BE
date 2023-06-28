const Workflow = require('@models/settings/Workflow');
const CRUD = require('@CRUD');

module.exports = new Workflow({
    collection: 'validations',
    displayName: 'Validations - Workflow',
    workflowEvents: [
        {
            name: 'create',
            handler: async function (target) {
                try {
                    // const populated = await target.populate([
                    //     {
                    //         path: 'assignedUsers',
                    //         model: 'users',
                    //         populate: [
                    //             { path: 'auth', model: 'auth_buckets'}
                    //         ]
                    //     },
                    //     {
                    //         path: 'ticket',
                    //         model: 'tickets',
                    //         populate: [
                    //             {
                    //                 path: 'space',
                    //                 model: 'space_desks'
                    //             }
                    //         ]
                    //     }
                    // ]);

                    // const task = populated.initialize();
                    // const created = await task.jiraCreateTask();
                    
                    // return created;
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        },
        {
            name: 'update',
            handler: async (target) => {
                // try {
                //     const taskDoc = await CRUD.getDoc({collectionName: 'tasks', filter: target.getFilter() }).defaultPopulate();
                //     const task = taskDoc.initialize();
                //     const updateProps = target.getUpdateProps();
                    
                //     return await task.jiraUpdatetask(updateProps);
                // } catch (err) {
                //     throw new Error.Log(err);
                // }
            }
        }
    ],
    statuses: [
        
    ]
});
