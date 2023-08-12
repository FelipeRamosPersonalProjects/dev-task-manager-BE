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
            ref: 'users',
            refConfig: {
                relatedField: 'myTemplates',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'type',
            type: String,
            default: 'pr-description',
            enum: ['ticket-title', 'task-title', 'pr-title', 'pr-description'],
            enumLabels: [
                { value: 'ticket-title', label: 'Ticket Title' },
                { value: 'task-title', label: 'Task Title' },
                { value: 'pr-title', label: 'Pull Request Title'},
                { value: 'pr-description', label: 'Pull Request Description'},
            ]
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
            default: [],
            refConfig: {
                relatedField: 'templates',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'spaces',
            type: [ObjectId],
            ref: 'space_desks',
            default: [],
            refConfig: {
                relatedField: 'templates',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'projects',
            type: [ObjectId],
            ref: 'projects',
            default: [],
            refConfig: {
                relatedField: 'templates',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'repos',
            type: [ObjectId],
            ref: 'repos',
            default: [],
            refConfig: {
                relatedField: 'templates',
                type: 'array-oid'
            }
        }
    ]
});
