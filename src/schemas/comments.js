const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'comments',
    symbol: 'COMM',
    schema: {
        user: {
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'comments',
                type: 'array-oid'
            })
        },
        parent: {
            type: ObjectId,
            ref: 'comments',
            refConfig: new Schema.RefConfig({
                relatedField: 'replies',
                type: 'array-oid'
            })
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
            ref: 'pull_requests',
            refConfig: new Schema.RefConfig({
                relatedField: 'comments',
                type: 'array-oid'
            })
        },
        ticket: {
            type: ObjectId,
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                relatedField: 'comments',
                type: 'array-oid'
            })
        },
        task: {
            type: ObjectId,
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'comments',
                type: 'array-oid'
            })
        }
    }
});
