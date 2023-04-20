const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const { SLA } = require('./map');
const events = require('./events');
const queries = require('./queries');

module.exports = new Schema({
    name: 'tickets',
    symbol: 'TICK',
    events: events.tickets,
    queries: queries.tickets,
    schema: {
        source: {
            type: String,
            default: 'jira',
            enum: ['jira', 'github']
        },
        ticketID: {
            type: String,
            immutable: true,
            unique: true
        },
        ticketURL: {
            type: String,
            required: true,
            immutable: true,
            unique: true
        },
        assignedUsers: {
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'tickets',
                type: 'array-oid'
            })
        },
        project: {
            type: ObjectId,
            required: true,
            ref: 'projects',
            refConfig: new Schema.RefConfig({
                relatedField: 'tickets',
                type: 'array-oid'
            })
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            default: 'progress',
            enum: ['progress', 'development', 'testing', 'pending-client', 'resolved', 'closed']
        },
        sla: {
            type: SLA,
            default: {}
        },
        estimations: {
            type: [ObjectId],
            default: [],
            ref: 'estimations',
            refConfig: new Schema.RefConfig({
                type: 'ObjectId',
                relatedField: 'ticket'
            })
        },
        tasks: {
            type: [ObjectId],
            default: [],
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'ticket',
                type: 'ObjectId'
            })
        },
        comments: {
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: new Schema.RefConfig({
                relatedField: 'ticket',
                type: 'ObjectId'
            })
        },
        pullRequests: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: new Schema.RefConfig({
                relatedField: 'ticket',
                type: 'ObjectId'
            })
        }
    }
});
