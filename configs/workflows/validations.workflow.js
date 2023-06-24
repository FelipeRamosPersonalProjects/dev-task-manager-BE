const Workflow = require('@models/settings/Workflow');
const CRUD = require('@CRUD');

module.exports = new Workflow({
    collection: 'tasks',
    displayName: 'Tasks - Workflow',
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
        {
            statusID: 'TO-INVESTIGATE',
            displayName: 'To Investigate',
            next: 'UNDER-INVESTIGATION'
        },
        {
            statusID: 'UNDER-INVESTIGATION',
            displayName: 'Under Investigation',
            next: 'COMPLETED',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    // try {
                    //     const taskDoc = await CRUD.getDoc({collectionName: 'tasks', filter: target.getFilter() }).defaultPopulate();
                    //     const task = taskDoc.initialize();

                    //     return await task.jiraTransitionStatus(this);
                    // } catch (err) {
                    //     throw new Error.Log(err);
                    // }
                }
            }]
        },
        {
            statusID: 'COMPLETED',
            displayName: 'Completed'
        },
        {
            statusID: 'ABORTED',
            displayName: 'Aborted'
        },
        {
            statusID: 'SHARED',
            displayName: 'Shared'
        },
        {
            statusID: 'ON-HOLD',
            displayName: 'On Hold'
        }
    ]
});
