const Workflow = require('@models/settings/Workflow');
const CRUD = require('@CRUD');

module.exports = new Workflow({
    collection: 'estimations',
    displayName: 'Estimations - Workflow',
    workflowEvents: [
        {
            name: 'create',
            handler: async function (target) {
                try {
                    const populated = await target.populate([
                        {
                            path: 'assignedUsers',
                            model: 'users',
                            populate: [
                                {
                                    path: 'auth',
                                    model: 'auth_buckets'
                                }
                            ]
                        },
                        {
                            path: 'ticket',
                            model: 'tickets',
                            populate: [
                                {
                                    path: 'space',
                                    model: 'space_desks'
                                }
                            ]
                        },
                        {
                            path: 'task',
                            model: 'tasks'
                        }
                    ]);

                    const estimation = populated.initialize();
                    const created = await estimation.jiraCreate();
                    
                    return created;
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        },
        {
            name: 'update',
            handler: async function(target) {
                try {
                    const estimationDoc = await CRUD.getDoc({ collectionName: 'estimations', filter: target.getFilter() }).defaultPopulate();
                    const estimation = estimationDoc.initialize();
                    const updateProps = target.getUpdateProps();
                    
                    return await estimation.jiraUpdate(updateProps);
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        }
    ],
    statuses: [
        {
            statusID: 'TO-ESTIMATE',
            jiraID: 11,
            displayName: 'To Estimate',
            next: 'WAITING-APPROVAL'
        },
        {
            statusID: 'WAITING-APPROVAL',
            jiraID: '21',
            displayName: 'Waiting Approval',
            next: 'ESTIMATION-APPROVED',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const estimationDoc = await CRUD.getDoc({ collectionName: 'estimations', filter: target.getFilter() }).defaultPopulate();
                        const estimation = estimationDoc.initialize();

                        return await estimation.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ESTIMATION-APPROVED',
            displayName: 'Estimation Approved',
            jiraID: 141,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const estimationDoc = await CRUD.getDoc({ collectionName: 'estimations', filter: target.getFilter() }).defaultPopulate();
                        const estimation = estimationDoc.initialize();

                        return await estimation.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'REJECTED',
            displayName: 'Rejected',
            jiraID: 41,
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const estimationDoc = await CRUD.getDoc({ collectionName: 'estimations', filter: target.getFilter() }).defaultPopulate();
                        const estimation = estimationDoc.initialize();

                        return await estimation.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ABORTED',
            jiraID: 91,
            displayName: 'Aborted',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const estimationDoc = await CRUD.getDoc({ collectionName: 'estimations', filter: target.getFilter() }).defaultPopulate();
                        const estimation = estimationDoc.initialize();

                        return await estimation.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'SHARED',
            jiraID: 111,
            displayName: 'Shared',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const estimationDoc = await CRUD.getDoc({ collectionName: 'estimations', filter: target.getFilter() }).defaultPopulate();
                        const estimation = estimationDoc.initialize();

                        return await estimation.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ON-HOLD',
            jiraID: 121,
            displayName: 'On Hold',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const estimationDoc = await CRUD.getDoc({ collectionName: 'estimations', filter: target.getFilter() }).defaultPopulate();
                        const estimation = estimationDoc.initialize();

                        return await estimation.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        }
    ]
});
