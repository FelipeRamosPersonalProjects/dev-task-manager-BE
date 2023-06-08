const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'comments',
    symbol: 'COMM',
    displayName: 'Comments',
    pluralLabel: 'comments',
    singularLabel: 'comment',
    fieldsSet: [
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
            fieldName: 'body',
            type: String
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
            fieldName: 'codeReview',
            type: ObjectId,
            ref: 'code_reviews',
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
        },
        {
            fieldName: 'gitHub',
            type: Object
        }
    ]
});
