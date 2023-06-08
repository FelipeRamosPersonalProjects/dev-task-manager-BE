const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'labels',
    symbol: 'LBL',
    displayName: 'Labels',
    pluralLabel: 'Labels',
    singularLabel: 'Label',
    fieldsSet: [
        {
            fieldName: 'name',
            type: String,
            required: true
        },
        {
            fieldName: 'projects',
            type: [ObjectId],
            default: [],
            ref: 'projects',
            refConfig: {
                relatedField: 'prLabels',
                type: 'array-oid'
            }
        }
    ]
});
