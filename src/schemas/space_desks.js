const Collection = require('@Collection');
const { ObjectId } = Collection.Types;
const TemplateOptionsMap = require('./map/TemplatesOptions');

module.exports = new Collection({
    name: 'space_desks',
    symbol: 'SPDK',
    displayName: 'SpaceDesks',
    pluralLabel: 'SpaceDesks',
    singularLabel: 'SpaceDesk',
    fieldsSet: [
        {
            fieldName: 'spaceName',
            type: String,
            required: true
        },
        {
            fieldName: 'jiraProject',
            type: String
        },
        {
            fieldName: 'owner',
            type: ObjectId,
            ref: 'users',
            refConfig: {
                relatedField: 'spaceDesks',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'projects',
            type: [ObjectId],
            default: [],
            ref: 'projects',
            refConfig: {
                relatedField: 'spaceDesks',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'templates',
            type: TemplateOptionsMap,
            default: {}
        }
    ]
});
