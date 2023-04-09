const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'pull_requests',
    symbol: 'PR',
    schema: {
        name: {
            type: String,
            required: true
        },
        remoteID: {
            type: String
        },
        base: {
            type: String,
            required: true
        },
        head: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        summary: {
            type: String
        },
        fileChanges: {
            type: [Object]
        },
        owner: {
            type: ObjectId,
            ref: 'users',
            required: true,
            refConfig: new Schema.RefConfig({
                relatedField: 'pullRequests',
                type: 'array-oid'
            })
        },
        assignedUsers: {
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'pullRequests',
                type: 'array-oid'
            })
        },
        reviewers: {
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'myReviews',
                type: 'array-oid'
            })
        },
        labels: {
            type: [String]
        },
        bmConfigs: {
            type: [Object],
            default: []
        },
        comments: {
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: new Schema.RefConfig({
                relatedField: 'pullRequest',
                type: 'ObjectId'
            })
        },
        ticket: {
            type: ObjectId,
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                relatedField: 'pullRequests',
                type: 'array-oid'
            })
        },
        task: {
            type: ObjectId,
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'pullRequests',
                type: 'array-oid'
            })
        }
    }
});
