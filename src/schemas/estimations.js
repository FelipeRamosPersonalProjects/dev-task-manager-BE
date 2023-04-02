const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'estimations',
    symbol: 'ESTM',
    schema: {
        type: {
            type: String,
            required: true,
            enum: ['FE', 'BE', 'QA']
        },
        timeAmount: {
            type: Number,
            required: true,
            min: 0
        },
        ticket: {
            type: ObjectId,
            required: true,
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                type: 'array-oid',
                relatedField: 'estimations'
            })
        },
        task: {
            type: ObjectId,
            required: true,
            ref: 'task',
            refConfig: new Schema.RefConfig({
                type: 'array-oid',
                relatedField: 'estimations'
            })
        }
    }
});
