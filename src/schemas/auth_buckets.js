const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'auth_buckets',
    symbol: 'AUTH',
    displayName: 'Auth Butckets',
    pluralLabel: 'Auth Butckets',
    singularLabel: 'Auth Butcket',
    fieldsSet: [
        {
            fieldName: 'rule',
            type: String,
            default: 'ANONYMOUS',
            enum: ['ANONYMOUS', 'DEVELOPER', 'PROJECT-MANAGER', 'TECH-LEAD', 'MENTOR', 'ADMIN', 'MASTER']
        },
        {
            fieldName: 'password',
            type: Buffer
        },
        {
            fieldName: 'gitHubToken',
            type: Buffer
        },
        {
            fieldName: 'jiraToken',
            type: Buffer
        },
        {
            fieldName: 'openAIToken',
            type: Buffer
        },
        {
            fieldName: 'user',
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: {
                relatedField: 'auth',
                type: 'ObjectId'
            }
        }
    ]
});
