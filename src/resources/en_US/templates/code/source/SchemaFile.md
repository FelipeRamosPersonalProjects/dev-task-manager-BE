const Schema = require('@models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const queries = require('@schemas/queries');
const events = require('@schemas/events');

module.exports = new Schema({
    name: '##{{collectionName:string}}##',
    symbol: '##{{symbol:string}}##',
    queries: queries.##{{collectionName:string}}##,
    events: events.##{{collectionName:string}}##,
    schema: {}
});

