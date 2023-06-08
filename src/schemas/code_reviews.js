const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'code_reviews',
    symbol: 'CORE',
    displayName: 'Code Reviews',
    pluralLabel: 'Code Reviews',
    singularLabel: 'Code Review',
    fieldsSet: [
        {
            fieldName: 'status',
            type: String,
            default: 'to-create-pr',
            enum: [
                'TO-CREATE-PR',
                'WAITING-APPROVAL',
                'CHANGES-REQUESTED',
                'APPROVED',
            ]
        },
        {
            fieldName: 'pullRequest',
            type: ObjectId,
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'codeReviews',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'ticket',
            type: ObjectId,
            ref: 'tickets',
            refConfig: {
                relatedField: 'codeReviews',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'devTask',
            type: ObjectId,
            ref: 'tasks',
            refConfig: {
                relatedField: 'codeReviews',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'reviwer',
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: {
                relatedField: 'myReviews',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'reviwerComments',
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: {
                relatedField: 'codeReview',
                type: 'ObjectId'
            }
        }
    ]
});
