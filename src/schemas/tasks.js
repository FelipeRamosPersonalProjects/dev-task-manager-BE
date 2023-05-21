const Schema = require('../models/SchemaDB');
const queries = require('./queries');
const events = require('./events');
const { ObjectId } = Schema.mongoSchema.Types;
const DiscoveryTask = require('@schemas/map/Discovery.map');
const DevelopmentTask = require('@schemas/map/Development.map');

module.exports = new Schema({
    name: 'tasks',
    symbol: 'TSK',
    queries: queries.tasks,
    events: events.tasks,
    schema: {
        taskType: {
            type: String,
            required: true,
            default: 'master-task',
            enum: ['master-task', 'sub-task', 'bug', 'discovery', 'code-review', 'development', 'validation']
        },
        isInternal: {
            type: Boolean,
            require: true,
            default: false
        },
        source: {
            type: String,
            default: 'jira',
            enum: ['jira', 'github']
        },
        taskVersion: {
            type: Number,
            default: 1
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
        description: {
            type: String
        },
        parentTask: {
            type: ObjectId,
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'subTasks',
                type: 'array-oid'
            })
        },
        subTasks: {
            type: [ObjectId],
            ref: 'tasks',
            default: [],
            refConfig: new Schema.RefConfig({
                relatedField: 'parentTask',
                type: 'ObjectId'
            })
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
        },
        
        discovery: DiscoveryTask.toObject(),
        development: DevelopmentTask.toObject()
    }
});
