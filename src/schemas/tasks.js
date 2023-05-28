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
            fieldName: 'taskType',
            type: String,
            required: true,
            default: 'master-task',
            enum: [
                'master-task',
                'sub-task',
                'bug',
                'discovery',
                'code-review',
                'development',
                'validation'
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
            fieldName: 'taskID',
            type: String,
            immutable: true,
            unique: true
        },
        {
            fieldName: 'taskURL',
            type: String,
            required: true,
            immutable: true,
            unique: true
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
        
        DiscoveryTask.toObject(),
        DevelopmentTask.toObject(),
        ValidationTask.toObject(),
        TODOReminderTask.toObject()
    ]
});
