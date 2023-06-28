const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'estimations',
    symbol: 'ESTM',
    displayName: 'Estimations',
    pluralLabel: 'Estimations',
    singularLabel: 'Estimation',
    fieldsSet: [
        {
            fieldName: 'status',
            type: String,
            default: 'TO-ESTIMATE',
            enum: [
                'TO-ESTIMATE',
                'WAITING-APPROVAL',
                'REJECTED',
                'ESTIMATION-APPROVED',
                'ABORTED',
                'ASK-TO-CLIENT',
                'REPLY-TO-CLIENT',
                'ON-HOLD',
                'CHANGES-REQUESTED',
            ]
        },
        {
            fieldName: 'type',
            type: String,
            default: 'DEV',
            enum: ['DEV', 'CR'],
            labels: {
                'DEV': 'Development',
                'CR': 'Changes Request'
            }
        },
        {
            fieldName: 'jiraIssue',
            type: Object
        },
        {
            fieldName: 'FE',
            type: Number,
            default: 0,
            min: 0
        },
        {
            fieldName: 'BE',
            type: Number,
            default: 0,
            min: 0
        },
        {
            fieldName: 'QA',
            type: Number,
            default: 0,
            min: 0
        },
        {
            fieldName: 'others',
            type: Number,
            default: 0,
            min: 0
        },
        {
            fieldName: 'unit',
            type: String,
            default: 'HOUR',
            enum: ['MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']
        },
        {
            fieldName: 'title',
            type: String,
            default: 'Estimation'
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                type: 'array-oid',
                relatedField: 'estimations'
            }
        },
        {
            fieldName: 'task',
            type: ObjectId,
            ref: 'tasks',
            refConfig: {
                type: 'array-oid',
                relatedField: 'estimations'
            }
        },
        {
            fieldName: 'assignedUsers',
            type: [ObjectId],
            default: [],
            ref: 'users',
            refConfig: {
                relatedField: 'estimations',
                type: 'array-oid'
            }
        }
    ]
});
