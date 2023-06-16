const Workflow = require('@models/settings/Workflow');
const CRUD = require('@CRUD');

module.exports = new Workflow({
    collection: 'tickets',
    displayName: 'Tickets - Workflow',
    workflowEvents: [
        {
            name: 'create',
            handler: async function (target) {
                try {
                    const populated = await target.populate([
                        {
                            path: 'assignedUsers',
                            model: 'users',
                            populate: [{ path: 'auth', model: 'auth_buckets'}]
                        },
                        {
                            path: 'project',
                            model: 'projects'
                        },
                        {
                            path: 'space',
                            model: 'space_desks'
                        }
                    ]);

                    const ticket = populated.initialize();
                    const created = await ticket.jiraCreateTicket();
                    
                    return created;
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        }
    ],
    statuses: [
        {
            statusID: 'TO-START',
            displayName: 'To Start',
            next: 'INVESTIGATION'
        },
        {
            statusID: 'INVESTIGATION',
            displayName: 'Investigation',
            next: 'ESTIMATION',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        debugger;
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ESTIMATION',
            displayName: 'Estimating',
            next: 'DEVELOPMENT'
        },
        {
            statusID: 'DEVELOPMENT',
            displayName: 'Development',
            next: 'PULL-REQUEST'
        },
        {
            statusID: 'PULL-REQUEST',
            displayName: 'Code Review',
            next: 'VALIDATION'
        },
        {
            statusID: 'VALIDATION',
            displayName: 'Validation',
            next: 'COMPLETED'
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
