const Collection = require('@Collection');
const Logstamp = require('./map/Logstamp');

module.exports = new Collection({
    name: 'worklogs',
    symbol: 'WORK',
    displayName: 'Worklogs',
    pluralLabel: 'worklogs',
    singularLabel: 'worklog',
    fieldsSet: [
        {
            type: String,
            fieldName: 'status',
            default: 'pending-worklog'
        },
        {
            fieldName: 'startTime',
            type: Date,
            required: true,
            default: Date.now
        },
        {
            fieldName: 'endTime',
            type: Date
        },
        {
            fieldName: 'summedTime',
            type: Number,
            default: 0
        },
        {
            fieldName: 'description',
            type: String
        },
        {
            fieldName: 'logstamps',
            type: [Logstamp.toObject()]
        }
    ]
}).initSchema();
