const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'organizations',
    symbol: 'ORG',
    links: {
        repos: 'organization',
        projects: 'organization',
    },
    schema: {
        name: {
            type: String,
            required: true
        },
        owner: {
            type: ObjectId,
            required: true
        },
        repos: {
            type: [ObjectId],
            default: [],
            ref: 'repos'
        }
    }
});
