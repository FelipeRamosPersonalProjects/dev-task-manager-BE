const Schema = require('../models/database/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;
const map = require('./map');
const Address = map.Address;

module.exports = new Schema({
    name: 'users',
    symbol: 'U',
    schema: {
        auth_UID: { type: SchemaTypes.String, required: true },
        firstName: { type: SchemaTypes.String, required: true },
        lastName: { type: SchemaTypes.String, required: true },
        email: { type: SchemaTypes.String, required: true },
        phone: { type: SchemaTypes.String, required: true },
        birthdate: { type: SchemaTypes.Date },
        address: { type: Address, default: {} }
    }
});
