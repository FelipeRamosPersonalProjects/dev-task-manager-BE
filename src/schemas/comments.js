const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'comments',
    symbol: 'COMM',
    displayName: 'Comments',
    pluralLabel: 'comments',
    singularLabel: 'comment',
    fields: [
        {
            fieldName: 'source',
            type: String,
            default: 'INTERNAL',
            enum: ['GITHUB', 'JIRA', 'INTERNAL']
        },
        {
            fieldName: 'commentType',
            type: String,
            required: true,
            default: 'STANDARD',
            enum: ['STANDARD', 'PR', 'REPLY', 'NOTE']
        },
        {
            fieldName: 'sourceID',
            type: Number
        },
        {
            fieldName: 'nodeID',
            type: String
        },
        {
            fieldName: 'diffHunk',
            type: String
        },
        {
            fieldName: 'filePath',
            type: String
        },
        {
            fieldName: 'body',
            type: String
        },
        {
            fieldName: 'sourceCreatedAt',
            type: Date
        },
        {
            fieldName: 'sourceUpdatedAt',
            type: Date
        },
        {
            fieldName: 'author',
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: {
                relatedField: 'myComments',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'parent',
            type: ObjectId,
            ref: 'comments',
            refConfig: {
                relatedField: 'replies',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'replies',
            type: ObjectId,
            ref: 'comments'
        },
        {
            fieldName: 'pullRequest',
            type: ObjectId,
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'comments',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                relatedField: 'comments',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'task',
            type: ObjectId,
            ref: 'tasks',
            refConfig: {
                relatedField: 'comments',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'thread',
            type: ObjectId,
            ref: 'threads',
            refConfig: {
                relatedField: 'parentComment',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'parentThread',
            type: ObjectId,
            ref: 'threads',
            refConfig: {
                relatedField: 'children',
                type: 'array-oid'
            }
        }
    ]
}).initSchema();
