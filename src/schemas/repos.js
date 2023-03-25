const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'repos',
    symbol: 'REPO',
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
            type: String
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
            type: ObjectId
        },
        project: {
            type: ObjectId,
            ref: 'projects'
        }
    }
});
