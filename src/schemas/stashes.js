const Schema = require('@models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const queries = require('@schemas/queries/stashes_query');

module.exports = new Schema({
    name: 'stashes',
    symbol: 'STSH',
    queries,
    schema: {
        author: {
            type: ObjectId,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'stashes',
                type: 'array-oid'
            })
        },
        type: {
            type: String,
            required: true,
            enum: ['draft', 'bring', 'temp', 'backup', 'stash', 'stash-backup']
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        branch: {
            type: String,
            required: true
        },
        task: {
            type: ObjectId,
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'stashes',
                type: 'array-oid'
            })
        },
        ticket: {
            type: ObjectId,
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                relatedField: 'stashes',
                type: 'array-oid'
            })
        },
        repo: {
            type: ObjectId,
            ref: 'repos',
            required: true,
            refConfig: new Schema.RefConfig({
                relatedField: 'stashes',
                type: 'array-oid'
            })
        },
        backupFolder: {
            type: String
        }
    }
});
