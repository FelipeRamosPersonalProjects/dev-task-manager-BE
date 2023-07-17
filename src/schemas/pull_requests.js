const Collection = require('@Collection');
const { ObjectId } = Collection.Types;
const FileChange = require('./map/FileChange');

module.exports = new Collection({
    name: 'pull_requests',
    symbol: 'PR',
    displayName: 'Pull Requests',
    pluralLabel: 'Pull Requests',
    singularLabel: 'Pull Request',
    fieldsSet: [
        {
            fieldName: 'gitHubPR',
            type: Object,
            default: {}
        },
        {
            fieldName: 'name',
            type: String,
            required: true
        },
        {
            fieldName: 'remoteID',
            type: String
        },
        {
            fieldName: 'state',
            type: String,
            default: 'OPEN',
            enum: [
                'OPEN',
                'CLOSED'
            ]
        },
        {
            fieldName: 'status',
            type: String,
            default: 'OPEN',
            enum: [
                'TO-CREATE-PR',
                'OPEN',
                'CLOSED',
                'TO-CREATE-PR',
                'FIXING-COMMENTS',
                'TO-CHECK-COMMENTS',
                'TO-REPLY-CLIENT',
                'TO-FIX',
                'WAITING-APPROVAL',
                'MERGED',
                'WAITING-MERGE',
                'TO-PUSH-METADATA',
                'ABORTED',
                'ON-HOLD'
            ]
        },
        {
            fieldName: 'prStage',
            type: String,
            required: true,
            default: 'initialized',
            enum: [
                'initialized',
                'branch-created',
                'commit-created',
                'compare-filled',
                'changes-description-filled',
                'published',
                'pendingChanges',
                'aborted',
                'merged'
            ]
        },
        {
            fieldName: 'isCurrentVersion',
            type: Boolean,
            default: true
        },
        {
            fieldName: 'version',
            type: Number,
            required: true,
            default: 1
        },
        {
            fieldName: 'base',
            type: String,
            required: true
        },
        {
            fieldName: 'head',
            type: String,
            required: true
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'summary',
            type: String
        },
        {
            fieldName: 'fileChanges',
            type: [FileChange],
            default: []
        },
        {
            fieldName: 'owner',
            type: ObjectId,
            ref: 'users',
            required: true,
            refConfig: {
                relatedField: 'pullRequests',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'assignedUsers',
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: {
                relatedField: 'pullRequests',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'codeReviews',
            type: [ObjectId],
            default: [],
            ref: 'code_reviews',
            refConfig: {
                relatedField: 'pull_request',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'labels',
            type: [String],
            default: []
        },
        {
            fieldName: 'bmConfigs',
            type: [Object],
            default: []
        },
        {
            fieldName: 'comments',
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: {
                relatedField: 'pullRequest',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                relatedField: 'pullRequests',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'task',
            type: ObjectId,
            ref: 'tasks',
            refConfig: {
                relatedField: 'pullRequests',
                type: 'array-oid'
            }
        }
    ]
});
