const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'repos',
    symbol: 'REPO',
    links: {
        owner: 'repos',
        organization: 'repos',
        projects: 'repos'
    },
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
            required: true
        },
        collaborators: {
            type: [ObjectId],
            default: [],
            ref: 'users'
        },
        organization: {
            type: ObjectId,
            ref: 'organizations'
        },
        projects: {
            type: [ObjectId],
            default: [],
            ref: 'projects'
        }
    }
});
