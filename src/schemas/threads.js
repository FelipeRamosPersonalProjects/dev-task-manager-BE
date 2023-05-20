const Schema = require('@models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const queries = require('@schemas/queries');
const events = require('@schemas/events');

module.exports = new Schema({
    name: 'threads',
    symbol: 'THRD',
    queries: queries.threads,
    events: events.threads,
    schema: {
        parentComment: {
            type: ObjectId,
            ref: 'comment',
            refConfig: new Schema.RefConfig({
                relatedField: 'thread',
                type: 'ObjectId'
            })
        },
        children: {
            type: [ObjectId],
            ref: 'comment',
            refConfig: new Schema.RefConfig({
                relatedField: 'parentThread',
                type: 'ObjectId'
            })
        }
    }
});

