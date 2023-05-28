const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'stashes',
    symbol: 'STSH',
    displayName: 'Stashs',
    pluralLabel: 'Stashs',
    singularLabel: 'Stash',
    fieldsSet: [
        {
            fieldName: 'author',
            type: ObjectId,
            ref: 'users',
            refConfig: {
                relatedField: 'stashes',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'type',
            type: String,
            required: true,
            enum: ['draft', 'bring', 'temp', 'backup', 'stash', 'stash-backup']
        },
        {
            fieldName: 'title',
            type: String
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'branch',
            type: String,
            required: true
        },
        {
            fieldName: 'task',
            type: ObjectId,
            ref: 'tasks',
            refConfig: {
                relatedField: 'stashes',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                relatedField: 'stashes',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'repo',
            type: ObjectId,
            ref: 'repos',
            required: true,
            refConfig: {
                relatedField: 'stashes',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'backupFolder',
            type: String
        }
    ]
});
