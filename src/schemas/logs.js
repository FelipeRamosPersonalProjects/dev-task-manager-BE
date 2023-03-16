const Schema = require('../models/database/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'logs',
    symbol: 'LG',
    schema: {
        type: {
            type: SchemaTypes.String,
            required: true,
            default: 'log',
            enum: ['log', 'warn', 'error']
        },
        read: {
            type: SchemaTypes.Boolean,
            default: false
        },
        name: {
            type: SchemaTypes.String,
            default: 'UnkownError'
        },
        code: {
            type: SchemaTypes.String
        },
        groupedLogs: {
            type: SchemaTypes.Number,
            default: 0
        },
        resource: {
            type: SchemaTypes.String
        },
        message: {
            type: SchemaTypes.String, 
            default: ''
        },
        stack: {
            type: SchemaTypes.String,
            default: ''
        },
        errorList: {
            type: SchemaTypes.String
        },
        validationErrors: {
            type: SchemaTypes.String
        },
        additionalData: {
            type: SchemaTypes.String,
            default: '{}'
        }
    }
});
