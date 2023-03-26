const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'tasks',
    symbol: 'TSK',
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
        }
    }
});
