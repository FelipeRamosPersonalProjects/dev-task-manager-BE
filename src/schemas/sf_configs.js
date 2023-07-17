const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'sf_configs',
    symbol: 'SFCONF',
    displayName: '',
    pluralLabel: '',
    singularLabel: '',
    fieldsSet: [
        {
            fieldName: 'type',
            type: String,
            default: 'SYSTEM-CUSTOM-PREFERENCES',
            enum: ['SYSTEM-CUSTOM-PREFERENCES']
        },
        {
            fieldName: 'customPreferenceType',
            type: String,
            default: 'SITE-PREFERENCE',
            enum: ['SITE-PREFERENCE']
        },
        {
            fieldName: 'configs',
            type: [Object],
            default: []
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                relatedField: 'sfConfigs',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'task',
            type: ObjectId,
            ref: 'tasks',
            refConfig: {
                relatedField: 'salesForceConfigs',
                type: 'array-oid'
            }
        }
    ]
});
