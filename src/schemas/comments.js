const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'comments',
    symbol: 'COMM',
    links: {
        pullRequest: 'comments',
        user: 'comments',
        ticket: 'comments',
        task: 'comments',
        parent: 'replies'
    },
    schema: {
        user: {
            type: ObjectId,
            required: true,
            ref: 'users'
        },
        parent: {
            type: ObjectId,
            ref: 'comments'
        },
        replies: {
            type: ObjectId,
            ref: 'comments'
        },
        message: {
            type: String,
            required: true
        },
        pullRequest: {
            type: ObjectId,
            ref: 'pull_requests'
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
