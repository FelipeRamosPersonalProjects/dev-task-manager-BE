const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'stashes',
    symbol: 'STSH',
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
            default: 'draft',
            enum: ['draft', 'bring', 'backup']
        },
        name: {
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
