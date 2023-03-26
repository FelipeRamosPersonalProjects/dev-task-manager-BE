const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'components',
    symbol: 'COMP',
    schema: {
        type: {
            type: String,
            required: true,
            enum: ['string']
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        outputModel: {
            type: String
        },
        loopTemplate: {
            type: ObjectId
        },
    }
});
