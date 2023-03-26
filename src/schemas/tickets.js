const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const { SLA } = require('./map');

module.exports = new Schema({
    name: 'tickets',
    symbol: 'TICK',
    links: {
        project: 'tickets',
        pullRequests: 'ticket',
        tasks: 'ticket',
        assignedUsers: 'tickets',
        comments: 'ticket'
    },
    schema: {
        ticketID: {
            type: String,
            required: true,
            immutable: true,
            unique: true
        },
        ticketURL: {
            type: String,
            required: true
        },
        assignedUsers: {
            type: [ObjectId],
            default: [],
            ref: 'users'
        },
        project: {
            type: ObjectId,
            required: true,
            ref: 'projects'
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
        tasks: {
            type: [ObjectId],
            default: [],
            ref: 'tasks'
        },
        comments: {
            type: [ObjectId],
            default: [],
            ref: 'comments'
        },
        pullRequests: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests'
        }
    }
});
