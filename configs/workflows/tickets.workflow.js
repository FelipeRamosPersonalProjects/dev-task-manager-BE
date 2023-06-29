const Workflow = require('@models/settings/Workflow');
const Task = require('@src/models/collections/Task');
const Estimation = require('@models/collections/Estimation');
const CRUD = require('@CRUD');

module.exports = new Workflow({
    collection: 'tickets',
    displayName: 'Tickets - Workflow',
    workflowEvents: [
        {
            name: 'create',
            handler: async function (target) {
                try {
                    const ticket = target.populated;
                    const created = await ticket.jiraCreateTicket();
                    
                    return created;
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        },
        {
            name: 'update',
            handler: async (target) => {
                try {
                    const ticket = target.populated;
                    const updateProps = target.getUpdateProps();
                    
                    return await ticket.jiraUpdateTicket(updateProps);
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        }
    ],
    statuses: [
        {
            statusID: 'FIRST-LOOK',
            jiraID: 11,
            displayName: 'First Look',
            next: 'INVESTIGATION',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        return await target.populated.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'INVESTIGATION',
            jiraID: 21,
            displayName: 'Investigation',
            next: 'ESTIMATION',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const ticket = target.populated;
                        const repos = ticket.getSafe('project.repos');
                        const newTask = await Task.createTask({
                            taskType: 'INVESTIGATION',
                            taskName: 'Investigation',
                            ticket: ticket._id,
                            project: ticket.getSafe('project._id'),
                            repo: repos.length ? repos[0]._id : undefined,
                            assignedUsers: ticket.assignedUsers.map(item => item._id)
                        });

                        if (newTask instanceof Error.Log) {
                            throw newTask;
                        }
                        
                        return await ticket.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ESTIMATION',
            jiraID: 31,
            displayName: 'Estimating',
            next: 'DEVELOPMENT',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const ticket = target.populated;
                        const newEstimation = await Estimation.create({
                            ticket: ticket._id,
                            assignedUsers: ticket.assignedUsers.map(item => item._id)
                        });

                        if (newEstimation instanceof Error.Log) {
                            throw newEstimation;
                        }

                        return await ticket.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'DEVELOPMENT',
            jiraID: 41,
            displayName: 'Development',
            next: 'PULL-REQUEST',
            events: [{
                name: 'transition',
                handler: async function (target) {
                    try {
                        const ticket = target.populated;
                        const repos = ticket.getSafe('project.repos');
                        const newDevTask = await Task.createTask({
                            taskType: 'DEVELOPMENT',
                            taskName: 'Development',
                            ticket: ticket._id,
                            project: ticket.getSafe('project._id'),
                            repo: repos.length ? repos[0]._id : undefined,
                            assignedUsers: ticket.assignedUsers.map(item => item._id)
                        });

                        if (newDevTask instanceof Error.Log) {
                            throw newDevTask;
                        }
                        
                        return await ticket.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'PULL-REQUEST',
            jiraID: 51,
            displayName: 'Pull Request',
            next: 'VALIDATION'
        },
        {
            statusID: 'VALIDATION',
            jiraID: 61,
            displayName: 'Validation',
            next: 'CLOSED',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const ticket = target.populated;

                        return await ticket.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'CLOSED',
            jiraID: 71,
            displayName: 'Closed',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const ticket = target.populated;
                        return await ticket.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ABORTED',
            jiraID: 81,
            displayName: 'Aborted',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const ticket = target.populated;
                        return await ticket.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        },
        {
            statusID: 'ON-HOLD',
            jiraID: 91,
            displayName: 'On Hold',
            events: [{
                name: 'transition',
                handler: async function(target) {
                    try {
                        const ticket = target.populated;
                        return await ticket.jiraTransitionStatus(this);
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }]
        }
    ]
});
