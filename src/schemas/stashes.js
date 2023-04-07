const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'stashes',
    symbol: 'STSH',
    schema: {
        stashIndex: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        user: {
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'stashes',
                type: 'array-oid'
            })
        },
        task: {
            type: ObjectId,
            ref: 'tasks',
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
        }
    }
});
