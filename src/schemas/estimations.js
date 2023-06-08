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
            fieldName: 'type',
            type: String,
            required: true,
            enum: ['FE', 'BE', 'QA']
        },
        {
            fieldName: 'timeAmount',
            type: Number,
            required: true,
            min: 0
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            required: true,
            ref: 'tickets',
            refConfig: {
                type: 'array-oid',
                relatedField: 'estimations'
            }
        },
        {
            fieldName: 'task',
            type: ObjectId,
            required: true,
            ref: 'task',
            refConfig: {
                type: 'array-oid',
                relatedField: 'estimations'
            }
        }
    ]
});
