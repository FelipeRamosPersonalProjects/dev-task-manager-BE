const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'repos',
    symbol: 'REPO',
    displayName: 'Repositiries',
    pluralLabel: 'Repositiries',
    singularLabel: 'Repositiry',
    fieldsSet: [
        {
            fieldName: 'nodeVersion',
            type: String
        },
        {
            fieldName: 'baseBranch',
            type: String
        },
        {
            fieldName: 'repoName',
            type: String
        },
        {
            fieldName: 'repoPath',
            type: String
        },
        {
            fieldName: 'localPath',
            type: String
        },
        {
            fieldName: 'url',
            type: String,
            required: true
        },
        {
            fieldName: 'owner',
            type: ObjectId,
            ref: 'users',
            refConfig: {
                relatedField: 'repos',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'collaborators',
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: {
                relatedField: 'repos',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'organization',
            type: ObjectId,
            ref: 'organizations',
            refConfig: {
                relatedField: 'repos',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'projects',
            type: [ObjectId],
            default: [],
            ref: 'projects',
            refConfig: {
                relatedField: 'repos',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'stashes',
            type: [ObjectId],
            ref: 'stashes',
            refConfig: {
                relatedField: 'repo',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'pullRequests',
            type: [ObjectId],
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'repo',
                type: 'ObjectId'
            }
        }
    ]
});
