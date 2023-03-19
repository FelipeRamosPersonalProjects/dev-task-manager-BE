const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'comments',
    symbol: 'COMM',
    schema: {
        parent: {
            type: ObjectId,
            ref: 'comments'
        },
        message: {
            type: String,
            required: true
        }
    }
});
