const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const queries = require('./queries');

module.exports = new Schema({
    name: 'repos',
    symbol: 'REPO',
    queries: queries.repos,
    schema: {
        nodeVersion: {
            type: String
        },
        baseBranch: {
            type: String
        },
        repoName: {
            type: String
        },
        repoPath: {
            type: String
        },
        localPath: {
            type: String
        },
        url: {
            type: String,
            required: true
        },
        owner: {
            type: ObjectId,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'repos',
                type: 'array-oid'
            })
        },
        collaborators: {
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'repos',
                type: 'array-oid'
            })
        },
        organization: {
            type: ObjectId,
            ref: 'organizations',
            refConfig: new Schema.RefConfig({
                relatedField: 'repos',
                type: 'array-oid'
            })
        },
        projects: {
            type: [ObjectId],
            default: [],
            ref: 'projects',
            refConfig: new Schema.RefConfig({
                relatedField: 'repos',
                type: 'array-oid'
            })
        }
    }
});
