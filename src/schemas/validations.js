const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'validations',
    symbol: 'VALD',
    displayName: 'Validations',
    pluralLabel: 'Validations',
    singularLabel: 'Validation',
    fieldsSet: [
        {
            fieldName: 'title',
            type: String
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'instance',
            type: String,
            default: 'DEV',
            enum: [
                'DEV',
                'STG',
                'PROD'
            ]
        },
        {
            fieldName: 'reportSummary',
            type: String
        },
        {
            fieldName: 'conclusion',
            type: String
        },
        {
            fieldName: 'testingSteps',
            type: [ObjectId],
            ref: 'testing_steps',
            refConfig: {
                relatedField: 'validation',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                relatedField: 'validations',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'tasks',
            type: [ObjectId],
            ref: 'tasks',
            refConfig: {
                relatedField: 'validations',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'pullRequest',
            type: ObjectId,
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'validations',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'assignedUsers',
            type: [ObjectId],
            required: true,
            default: [],
            ref: 'users',
            refConfig: {
                relatedField: 'validations',
                type: 'array-oid'
            }
        }
    ]
});
