const Collection = require('@Collection');
const DiscoveryTask = require('@src/schemas/map/Discovery.task');
const DevelopmentTask = require('@src/schemas/map/Development.task');
const ValidationTask = require('@src/schemas/map/Validation.task');
const TODOReminderTask = require('@src/schemas/map/TODOReminder.task');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'tasks',
    symbol: 'TSK',
    displayName: 'Tasks',
    pluralLabel: 'Tasks',
    singularLabel: 'Task',
    fieldsSet: [
        {
            fieldName: 'status',
            type: String,
            default: 'TO-INVESTIGATE',
            enum: [
                'TO-INVESTIGATE',
                'UNDER-INVESTIGATION',
                'ASK-TO-CLIENT',
                'ASK-TO-TEAM',
                'TO-REPLY-CLIENT',
                'TO-TEST',
                'DONE',
                'ABORTED',
                'ON-HOLD',
                'TO-START-DEVELOPMENT',
                'IN-DEVELOPMENT',
                'BLOCKED',
                'QUESTION-RAISED',
                'ASK-TO-PM',
                'TO-CREATE-PROOFS',
                'BUG-DETECTED',
                'SELF-TEST'
            ]
        },
        {
            fieldName: 'taskType',
            type: String,
            required: true,
            enum: [
                'INVESTIGATION',
                'DEVELOPMENT'
            ]
        },
        {
            fieldName: 'isInternal',
            type: Boolean,
            require: true,
            default: false
        },
        {
            fieldName: 'source',
            type: String,
            default: 'jira',
            enum: ['jira', 'github']
        },
        {
            fieldName: 'taskVersion',
            type: Number,
            default: 1
        },
        {
            fieldName: 'taskName',
            type: String,
            required: true
        },
        {
            fieldName: 'externalKey',
            type: String
        },
        {
            fieldName: 'externalURL',
            type: String
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'parentTask',
            type: ObjectId,
            ref: 'tasks',
            refConfig: {
                relatedField: 'subTasks',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'subTasks',
            type: [ObjectId],
            ref: 'tasks',
            default: [],
            refConfig: {
                relatedField: 'parentTask',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'project',
            type: ObjectId,
            ref: 'projects',
            refConfig: {
                relatedField: 'tasks',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'assignedUsers',
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: {
                relatedField: 'tasks',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'jiraIssue',
            type: Object
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                relatedField: 'tasks',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'dueDate',
            type: Date
        },
        {
            fieldName: 'estimations',
            type: [ObjectId],
            default: [],
            ref: 'estimations',
            refConfig: {
                type: 'ObjectId',
                relatedField: 'task'
            }
        },
        {
            fieldName: 'sharedWith',
            type: String
        },
        {
            fieldName: 'pullRequests',
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'task',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'comments',
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: {
                relatedField: 'task',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'configs',
            type: [Object],
            default: []
        },
        {
            fieldName: 'stashes',
            type: [ObjectId],
            ref: 'stashes',
            refConfig: {
                relatedField: 'task',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'repo',
            type: ObjectId,
            ref: 'repos',
            refConfig: {
                relatedField: 'tasks',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'codeReviews',
            type: [ObjectId],
            default: [],
            ref: 'code_reviews',
            refConfig: {
                relatedField: 'devTask',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'discovery',
            type: DiscoveryTask.toObject()
        },
        {
            fieldName: 'development',
            type: DevelopmentTask.toObject()
        },
        {
            fieldName: 'validation',
            type: ValidationTask.toObject()
        },
        {
            fieldName: 'todo',
            type: TODOReminderTask.toObject()
        }
    ]
});
