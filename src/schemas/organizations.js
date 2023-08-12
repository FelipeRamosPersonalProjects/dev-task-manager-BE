const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'organizations',
    symbol: 'ORG',
    displayName: 'Organizations',
    pluralLabel: 'Organizations',
    singularLabel: 'Organization',
    fieldsSet: [
        {
            fieldName: 'name',
            type: String,
            required: true
        },
        {
            fieldName: 'owner',
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: {
                relatedField: 'myOrganizations',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'repos',
            type: [ObjectId],
            default: [],
            ref: 'repos',
            refConfig: {
                relatedField: 'organization',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'projects',
            type: [ObjectId],
            default: [],
            ref: 'projects',
            refConfig: {
                relatedField: 'organization',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'templates',
            type: [ObjectId],
            default: [],
            ref: 'templates',
            refConfig: {
                relatedField: 'organizations',
                type: 'array-oid'
            }
        }
    ]
});
