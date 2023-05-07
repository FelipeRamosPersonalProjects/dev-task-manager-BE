const Schema = require('@models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const events = require('./events/auth_buckets_events');

module.exports = new Schema({
    name: 'auth_buckets',
    symbol: 'AUTH',
    events,
    schema: {
        rule: {
            type: String,
            default: 'incognito',
            enum: ['incognito', 'client', 'admin', 'manager', 'master']
        },
        password: {
            type: String
        },
        gitHubToken: {
            type: Buffer
        },
        jiraToken: {
            type: Buffer
        },
        openAIToken: {
            type: Buffer
        },
        user: {
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'auth',
                type: 'ObjectId'
            })
        }
    }
});
