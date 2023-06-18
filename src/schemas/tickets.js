const Collection = require('@Collection');
const { ObjectId } = Collection.Types;
const { SLA } = require('./map');

module.exports = new Collection({
    name: 'tickets',
    symbol: 'TICK',
    displayName: 'Tickets',
    pluralLabel: 'tickets',
    singularLabel: 'ticket',
    fieldsSet: [
        {
            fieldName: 'externalSource',
            type: String,
            default: 'jira',
            enum: ['jira', 'github']
        },
        {
            fieldName: 'jiraIssue',
            type: Object
        },
        {
            fieldName: 'externalKey',
            type: String,
            immutable: true,
            unique: true
        },
        {
            fieldName: 'externalURL',
            type: String,
            required: true,
            immutable: true,
            unique: true
        },
        {
            fieldName: 'assignedUsers',
            type: [ObjectId],
            required: true,
            default: [],
            ref: 'users',
            refConfig: {
                relatedField: 'tickets',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'space',
            type: ObjectId,
            required: true,
            ref: 'space_desks',
            refConfig: {
                relatedField: 'tickets',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'project',
            type: ObjectId,
            required: true,
            ref: 'projects',
            refConfig: {
                relatedField: 'tickets',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'title',
            type: String,
            required: true
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'status',
            type: String,
            default: 'TO-START',
            enum: [
                'TO-START',
                'INVESTIGATION',
                'ESTIMATION',
                'DEVELOPMENT',
                'PULL-REQUEST',
                'VALIDATION',
                'COMPLETED',
                'ABORTED',
                'SHARED',
                'ON-HOLD'
            ]
        },
        {
            fieldName: 'sla',
            type: SLA,
            default: {}
        },
        {
            fieldName: 'estimations',
            type: [ObjectId],
            default: [],
            ref: 'estimations',
            refConfig: {
                type: 'ObjectId',
                relatedField: 'ticket'
            }
        },
        {
            fieldName: 'tasks',
            type: [ObjectId],
            default: [],
            ref: 'tasks',
            refConfig: {
                relatedField: 'ticket',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'comments',
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: {
                relatedField: 'ticket',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'pullRequests',
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'ticket',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'stashes',
            type: [ObjectId],
            ref: 'stashes',
            refConfig: {
                relatedField: 'ticket',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'codeReviews',
            type: [ObjectId],
            ref: 'code_reviews',
            refConfig: {
                relatedField: 'ticket',
                type: 'ObjectId'
            }
        }
    ]
});
