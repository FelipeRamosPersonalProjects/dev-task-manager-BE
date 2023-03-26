const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'pull_requests',
    symbol: 'PR',
    links: {
        ticket: 'pullRequests',
        task: 'pullRequests',
        owner: 'myPullRequests',
        assignedUsers: 'pullRequests',
        reviewers: 'myReviews',
        comments: 'pullRequest'
    },
    schema: {
        prName: {
            type: String,
            required: true
        },
        prGitHubID: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        fileChanges: {
            type: [Object]
        },
        owner: {
            type: ObjectId,
            ref: 'users',
            required: true
        },
        assignedUsers: {
            type: [ObjectId],
            default: [],
            ref: 'users'
        },
        reviewers: {
            type: [ObjectId],
            default: [],
            ref: 'users'
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
            ref: 'comments'
        },
        ticket: {
            type: ObjectId,
            ref: 'tickets'
        },
        task: {
            type: ObjectId,
            ref: 'tasks'
        }
    }
});
