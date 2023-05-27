const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const FileChange = require('./map/FileChange');
const queries = require('@schemas/queries');

module.exports = new Schema({
    name: 'pull_requests',
    symbol: 'PR',
    queries: queries.pull_requests,
    schema: {
        gitHubPR: {
            type: Object,
            default: {}
        },
        name: {
            type: String,
            required: true
        },
        remoteID: {
            type: String
        },
        status: {
            type: String,
            default: 'OPEN',
            enum: ['OPEN', 'CLOSED', 'CHANGES-REQUESTED']
        },
        prStage: {
            type: String,
            required: true,
            default: 'initialized',
            enum: ['initialized', 'branch-created', 'commit-created', 'compare-filled', 'changes-description-filled', 'published', 'pendingChanges', 'aborted', 'merged']
        },
        isCurrentVersion: {
            type: Boolean,
            default: true
        },
        version: {
            type: Number,
            required: true,
            default: 1
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
            type: [FileChange],
            default: []
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
        codeReviews: {
            type: [ObjectId],
            default: [],
            ref: 'code_reviews',
            refConfig: new Schema.RefConfig({
                relatedField: 'pull_request',
                type: 'ObjectId'
            })
        },
        labels: {
            type: [String],
            default: []
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
