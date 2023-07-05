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
                    const populated = await target.populate([
                        {
                            path: 'assignedUsers',
                            model: 'users',
                            populate: [
                                { path: 'auth', model: 'auth_buckets'}
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
                        }
                    ]);

                    const task = populated.initialize();
                    const created = await task.jiraCreateTask();
                    
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
                    const updateProps = target.getUpdateProps();
                    return await target.populated.jiraUpdate(updateProps);
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        }
    ],
    preventStatus: function (target) {
        try {
            return (Object(target).getSafe('populated.taskType') !== this.taskType);
        } catch (err) {
            throw new Error.Log(err);
        }
    },
    statuses: [
        {
            statusID: 'TO-INVESTIGATE',
            jiraID: 11,
            displayName: 'To Investigate',
            taskType: 'INVESTIGATION',
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
            statusID: 'UNDER-INVESTIGATION',
            jiraID: 21,
            displayName: 'Under Investigation',
            taskType: 'INVESTIGATION',
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
            statusID: 'ASK-TO-CLIENT',
            jiraID: 31,
            displayName: 'Ask to Client',
            taskType: 'INVESTIGATION',
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
            statusID: 'ASK-TO-TEAM',
            jiraID: 41,
            displayName: 'Ask to Team',
            taskType: 'INVESTIGATION',
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
            statusID: 'ASK-TO-PM',
            jiraID: 91,
            displayName: 'Ask to PM',
            taskType: 'INVESTIGATION',
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
            statusID: 'QUESTION-RAISED',
            jiraID: 101,
            displayName: 'Question Raised',
            taskType: 'INVESTIGATION',
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
            statusID: 'TO-REPLY-CLIENT',
            jiraID: 51,
            displayName: 'To Reply Client',
            taskType: 'INVESTIGATION',
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
            statusID: 'TO-TEST',
            jiraID: 81,
            displayName: 'To Test',
            taskType: 'INVESTIGATION',
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
            statusID: 'DONE',
            jiraID: 71,
            displayName: 'Done',
            taskType: 'INVESTIGATION',
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
            statusID: 'ABORTED',
            jiraID: 61,
            displayName: 'Aborted',
            taskType: 'INVESTIGATION',
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
            statusID: 'ON-HOLD',
            displayName: 'On Hold',
            taskType: 'INVESTIGATION',
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
            jiraID: 11,
            statusID: 'TO-START-DEVELOPMENT',
            displayName: 'To Start Development',
            taskType: 'DEVELOPMENT',
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
            jiraID: 21,
            statusID: 'IN-DEVELOPMENT',
            displayName: 'In Development',
            taskType: 'DEVELOPMENT',
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
            jiraID: 31,
            statusID: 'DONE',
            displayName: 'Done',
            taskType: 'DEVELOPMENT',
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
            jiraID: 41,
            statusID: 'ABORTED',
            displayName: 'Aborted',
            taskType: 'DEVELOPMENT',
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
            jiraID: 51,
            statusID: 'ON-HOLD',
            displayName: 'On Hold',
            taskType: 'DEVELOPMENT',
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
            jiraID: 61,
            statusID: 'BLOCKED',
            displayName: 'Blocked',
            taskType: 'DEVELOPMENT',
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
            jiraID: 71,
            statusID: 'QUESTION-RAISED',
            displayName: 'Question Raised',
            taskType: 'DEVELOPMENT',
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
            jiraID: 81,
            statusID: 'ASK-TO-CLIENT',
            displayName: 'Ask to Client',
            taskType: 'DEVELOPMENT',
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
            jiraID: 91,
            statusID: 'ASK-TO-PM',
            displayName: 'Ask To PM',
            taskType: 'DEVELOPMENT',
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
            jiraID: 101,
            statusID: 'ASK-TO-TEAM',
            displayName: 'Ask to Team',
            taskType: 'DEVELOPMENT',
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
            jiraID: 111,
            statusID: 'TO-REPLY-CLIENT',
            displayName: 'To Reply Client',
            taskType: 'DEVELOPMENT',
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
            jiraID: 121,
            statusID: 'SELF-TEST',
            displayName: 'Self Test',
            taskType: 'DEVELOPMENT',
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
            jiraID: 131,
            statusID: 'TO-CREATE-PROOFS',
            displayName: 'To Create Proofs',
            taskType: 'DEVELOPMENT',
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
            jiraID: 141,
            statusID: 'BUG-DETECTED',
            displayName: 'Bug Detected',
            taskType: 'DEVELOPMENT',
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
        }
    ]
});
