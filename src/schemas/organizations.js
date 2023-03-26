const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'organizations',
    symbol: 'ORG',
    schema: {
        name: {
            type: String,
            required: true
        },
        owner: {
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'myOrganizations',
                type: 'array-oid'
            })
        },
        repos: {
            type: [ObjectId],
            default: [],
            ref: 'repos',
            refConfig: new Schema.RefConfig({
                relatedField: 'organization',
                type: 'ObjectId'
            })
        },
        projects: {
            type: [ObjectId],
            default: [],
            ref: 'projects',
            refConfig: new Schema.RefConfig({
                relatedField: 'organization',
                type: 'ObjectId'
            })
        }
    }
});
