const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'templates',
    symbol: 'TMPL',
    displayName: 'Templates',
    pluralLabel: 'Templates',
    singularLabel: 'Template',
    fieldsSet: [
        {
            fieldName: 'author',
            type: ObjectId,
            ref: 'users'
        },
        {
            fieldName: 'title',
            type: String,
            required: true
        },
        {
            fieldName: 'summary',
            type: String
        },
        {
            fieldName: 'body',
            type: String
        },
        {
            fieldName: 'organizations',
            type: [ObjectId],
            ref: 'organizations',
            default: []
        },
        {
            fieldName: 'spaces',
            type: [ObjectId],
            ref: 'space_desks',
            default: []
        },
        {
            fieldName: 'projects',
            type: [ObjectId],
            ref: 'projects',
            default: []
        },
        {
            fieldName: 'category',
            type: String,
            default: 'description',
            enum: ['title', 'description']
        }
    ]
});
