const Workflow = require('@models/settings/Workflow');

module.exports = new Workflow({
    workflowID: 'comments',
    displayName: 'Comments Workflow',
    statuses: [
        {
            statusID: 'TO-START',
            displayName: 'To Start',
            next: 'INVESTIGATING'
        },
        {
            statusID: 'INVESTIGATING',
            displayName: 'Investigating',
            next: 'ESTIMATION'
        },
        {
            statusID: 'ESTIMATION',
            displayName: 'Estimating',
            next: 'TO-DEVELOP'
        },
        {
            statusID: 'TO-DEVELOP',
            displayName: 'To Develop',
            next: 'IN-DEVELOPMENT'
        },
        {
            statusID: 'IN-DEVELOPMENT',
            displayName: 'In Development',
            next: 'DEVELOPMENT-DONE'
        },
        {
            statusID: 'DEVELOPMENT-DONE',
            displayName: 'Development Done',
            next: 'CODE-REVIEW'
        },
        {
            statusID: 'CODE-REVIEW',
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
