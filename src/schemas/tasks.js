const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'tasks',
    symbol: 'TSK',
    links: {
        project: 'tasks',
        assignedUsers: 'tasks',
        ticket: 'tasks',
        pullRequests: 'task',
        comments: 'task'
    },
    schema: {
        taskName: {
            type: String,
            required: true
        },
        taskCod: {
            type: String
        },
        description: {
            type: String
        },
        project: {
            type: ObjectId,
            ref: 'projects'
        },
        assignedUsers: {
            type: [ObjectId],
            default: [],
            ref: 'users'
        },
        ticket: {
            type: ObjectId,
            ref: 'tickets'
        },
        dueDate: {
            type: Date
        },
        sharedWith: {
            type: String
        },
        pullRequests: {
            type: [ObjectId],
            default: [],
            ref: 'pull_requests'
        },
        comments: {
            type: [ObjectId],
            default: [],
            ref: 'comments'
        },
        configs: {
            type: [Object],
            default: []
        }
    }
});
