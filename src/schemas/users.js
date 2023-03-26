const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'users',
    symbol: 'U',
    links: {
        repos: 'owner',
        spaceDesks: 'owner',
        tasks: 'assignedUsers',
        tickets: 'assignedUsers',
        myPullRequests: 'owner',
        pullRequestsAssigned: 'assignedUsers',
        comments: 'user'
    },
    schema: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        repos: {
            type: [ObjectId],
            default: [],
            ref: 'repos'
        },
        spaceDesks: {
            type: [ObjectId],
            default: [],
            ref: 'space_desks'
        },
        tickets: {
            type: [ObjectId],
            default: [],
            ref: 'tickets'
        },
        tasks: {
            type: [ObjectId],
            default: [],
            ref: 'tasks'
        },
        myPullRequests: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests'
        },
        myReviews: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests'
        },
        pullRequestsAssigned: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests'
        },
        comments: {
            type: [ObjectId],
            default: [],
            ref: 'comments'
        }
    }
});
