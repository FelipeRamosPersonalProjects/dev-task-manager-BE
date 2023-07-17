const Workflow = require('@models/settings/Workflow');
const CRUD = require('@CRUD');

module.exports = new Workflow({
    collection: 'pull_requests',
    displayName: 'Pull Requests - Workflow',
    workflowEvents: [
        {
            name: 'create',
            handler: async function (target) {
                // try {
                //     const populated = await target.populate([
                //         {
                //             path: 'assignedUsers',
                //             model: 'users',
                //             populate: [
                //                 { path: 'auth', model: 'auth_buckets'}
                //             ]
                //         },
                //         {
                //             path: 'ticket',
                //             model: 'tickets',
                //             populate: [
                //                 {
                //                     path: 'space',
                //                     model: 'space_desks'
                //                 }
                //             ]
                //         }
                //     ]);

                //     const task = populated.initialize();
                //     const created = await task.jiraCreateTask();
                    
                //     return created;
                // } catch (err) {
                //     throw new Error.Log(err);
                // }
            }
        },
        {
            name: 'update',
            handler: async (target) => {
                // try {
                //     const taskDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
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
            statusID: 'TO-CREATE-PR',
            displayName: 'To Create PR',
            jiraID: 11,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'FIXING-COMMENTS',
            displayName: 'Fixing Comments',
            jiraID: 21,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'TO-CHECK-COMMENTS',
            displayName: 'To Check Comments',
            jiraID: 31,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'TO-REPLY-CLIENT',
            displayName: 'To Reply Comment',
            jiraID: 41,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'TO-FIX',
            jiraID: 51,
            displayName: 'To Fix',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'WAITING-APPROVAL',
            displayName: 'Waiting Approval',
            jiraID: 61,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'MERGED',
            displayName: 'Merged',
            jiraID: 81,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'WAITING-MERGE',
            displayName: 'Waiting Merge',
            jiraID: 91,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'TO-PUSH-METADATA',
            displayName: 'To Push Metadata',
            jiraID: 121,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ABORTED',
            displayName: 'Aborted',
            jiraID: 101,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ON-HOLD',
            displayName: 'On Hold',
            jiraID: 111,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const pullRequestDoc = await CRUD.getDoc({collectionName: 'pull_requests', filter: target.getFilter() }).defaultPopulate();
                        const pullRequest = pullRequestDoc.initialize();

                        return await pullRequest.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        }
    ]
});
