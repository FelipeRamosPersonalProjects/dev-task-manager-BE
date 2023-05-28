const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'threads',
    symbol: 'THRD',
    displayName: 'Threads',
    pluralLabel: 'Threads',
    singularLabel: 'Thread',
    fieldsSet: [
        {
            fieldName: 'parentComment',
            type: ObjectId,
            ref: 'comment',
            refConfig: {
                relatedField: 'thread',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'children',
            type: [ObjectId],
            ref: 'comment',
            refConfig: {
                relatedField: 'parentThread',
                type: 'ObjectId'
            }
        }
    ]
});
