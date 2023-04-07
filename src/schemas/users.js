const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'users',
    symbol: 'U',
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
            ref: 'repos',
            refConfig: new Schema.RefConfig({
                relatedField: 'owner',
                type: 'ObjectId'
            })
        },
        spaceDesks: {
            type: [ObjectId],
            default: [],
            ref: 'space_desks',
            refConfig: new Schema.RefConfig({
                relatedField: 'owner',
                type: 'ObjectId'
            })
        },
        tickets: {
            type: [ObjectId],
            default: [],
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                relatedField: 'assignedUsers',
                type: 'array-oid'
            })
        },
        tasks: {
            type: [ObjectId],
            default: [],
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'assignedUsers',
                type: 'array-oid'
            })
        },
        myPullRequests: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: new Schema.RefConfig({
                relatedField: 'owner',
                type: 'ObjectId'
            })
        },
        myReviews: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: new Schema.RefConfig({
                relatedField: 'reviewers',
                type: 'array-oid'
            })
        },
        pullRequestsAssigned: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: new Schema.RefConfig({
                relatedField: 'assignedUsers',
                type: 'array-oid'
            })
        },
        comments: {
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: new Schema.RefConfig({
                relatedField: 'user',
                type: 'ObjectId'
            })
        },
        myOrganizations: {
            type: [ObjectId],
            default: [],
            ref: 'organizations',
            refConfig: new Schema.RefConfig({
                relatedField: 'owner',
                type: 'ObjectId'
            })
        },
        stashes: {
            type: [ObjectId],
            ref: 'stashes',
            refConfig: new Schema.RefConfig({
                relatedField: 'user',
                type: 'ObjectId'
            })
        }
    }
});
