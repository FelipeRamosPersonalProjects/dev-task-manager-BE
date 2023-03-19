const Schema = require('../models/database/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const { SLA } = require('./map');

module.exports = new Schema({
    name: 'tickets',
    symbol: 'TICK',
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
        pullRequests: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests'
        }
    }
});
