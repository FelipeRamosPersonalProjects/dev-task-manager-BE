const Collection = require('@Collection');
const { ObjectId } = Collection.Types;
const TemplateOptionsMap = require('./map/TemplatesOptions');

module.exports = new Collection({
    name: 'projects',
    symbol: 'PRJ',
    displayName: 'Projects',
    pluralLabel: 'Projects',
    singularLabel: 'Project',
    fieldsSet: [
        {
            fieldName: 'projectKey',
            type: String,
            required: true,
            unique: true,
            immutable: true
        },
        {
            fieldName: 'projectName',
            type: String,
            required: true
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'urls',
            type: Array,
            default: []
        },
        {
            fieldName: 'tickets',
            type: [ObjectId],
            default: [],
            ref: 'tickets',
            refConfig: {
                relatedField: 'project',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'tasks',
            type: [ObjectId],
            default: [],
            ref: 'tasks',
            refConfig: {
                relatedField: 'project',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'repos',
            type: [ObjectId],
            default: [],
            ref: 'repos',
            refConfig: {
                relatedField: 'projects',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'spaceDesk',
            type: ObjectId,
            ref: 'space_desks',
            refConfig: {
                relatedField: 'projects',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'organization',
            type: ObjectId,
            ref: 'organizations',
            refConfig: {
                relatedField: 'projects',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'templates',
            type: [ObjectId],
            default: [],
            ref: 'templates',
            refConfig: {
                relatedField: 'projects',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'reviewers',
            type: [ObjectId],
            ref: 'users',
            default: []
        },
        {
            fieldName: 'prLabels',
            type: [ObjectId],
            default: [],
            ref: 'labels',
            refConfig: {
                relatedField: 'projects',
                type: 'array-oid'
            }
        }
    ]
});
