const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'comments',
    symbol: 'COMM',
    schema: {
        source: {
            type: String,
            required: true,
            default: 'INTERNAL',
            enum: ['GITHUB', 'JIRA', 'INTERNAL']
        },
        commentType: {
            type: String,
            required: true,
            default: 'STANDARD',
            enum: ['STANDARD', 'PR', 'REPLY', 'NOTE']
        },
        sourceID: {
            type: Number
        },
        nodeID: {
            type: String
        },
        diffHunk: {
            type: String
        },
        filePath: {
            type: String
        },
        body: {
            type: String
        },
        sourceCreatedAt: {
            type: Date
        },
        sourceUpdatedAt: {
            type: Date
        },
        author: {
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'myComments',
                type: 'array-oid'
            })
        },
        parent: {
            type: ObjectId,
            ref: 'comments',
            refConfig: new Schema.RefConfig({
                relatedField: 'replies',
                type: 'array-oid'
            })
        },
        replies: {
            type: ObjectId,
            ref: 'comments'
        },
        pullRequest: {
            type: ObjectId,
            ref: 'pull_requests',
            refConfig: new Schema.RefConfig({
                relatedField: 'comments',
                type: 'array-oid'
            })
        },
        ticket: {
            type: ObjectId,
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                relatedField: 'comments',
                type: 'array-oid'
            })
        },
        task: {
            type: ObjectId,
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'comments',
                type: 'array-oid'
            })
        },
        parentThread: {
            type: ObjectId,
            ref: 'threads',
            refConfig: Schema.RefConfig({
                relatedField: 'children',
                type: 'array-oid'
            })
        }
    }
});
