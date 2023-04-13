const Schema = require('../models/SchemaDB');
const queries = require('./queries');
const events = require('./events');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'tasks',
    symbol: 'TSK',
    queries: queries.tasks,
    events: events.tasks,
    schema: {
        source: {
            type: String,
            default: 'jira',
            enum: ['jira', 'github']
        },
        taskName: {
            type: String,
            required: true
        },
        taskID: {
            type: String,
            immutable: true,
            unique: true
            
        },
        taskURL: {
            type: String,
            required: true,
            immutable: true,
            unique: true
        },
        branchVersion: {
            type: Number,
            default: 1
        },
        description: {
            type: String
        },
        project: {
            type: ObjectId,
            ref: 'projects',
            refConfig: new Schema.RefConfig({
                relatedField: 'tasks',
                type: 'array-oid'
            })
        },
        assignedUsers: {
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'tasks',
                type: 'array-oid'
            })
        },
        ticket: {
            type: ObjectId,
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                relatedField: 'tasks',
                type: 'array-oid'
            })
        },
        dueDate: {
            type: Date
        },
        estimations: {
            type: [ObjectId],
            default: [],
            ref: 'estimations',
            refConfig: new Schema.RefConfig({
                type: 'ObjectId',
                relatedField: 'task'
            })
        },
        sharedWith: {
            type: String
        },
        pullRequests: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: new Schema.RefConfig({
                relatedField: 'task',
                type: 'ObjectId'
            })
        },
        comments: {
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: new Schema.RefConfig({
                relatedField: 'task',
                type: 'ObjectId'
            })
        },
        configs: {
            type: [Object],
            default: []
        },
        stashes: {
            type: [ObjectId],
            ref: 'stashes',
            refConfig: new Schema.RefConfig({
                relatedField: 'task',
                type: 'ObjectId'
            })
        },
        repo: {
            type: ObjectId,
            ref: 'repos',
            refConfig: new Schema.RefConfig({
                relatedField: 'tasks',
                type: 'array-oid'
            })
        }
    }
});
