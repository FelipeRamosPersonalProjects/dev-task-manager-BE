const Schema = require('../models/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;
const config = require('../../config.json');
const collectionName = config.database.counterCollection;

module.exports = new Schema({
    name: collectionName,
    symbol: 'CN',
    schema: {
        _id: { type: SchemaTypes.String, immutable: true, required: true },
        symbol: { type: SchemaTypes.String, required: true },
        value: { type: SchemaTypes.Number, default: 0 },
    },
    excludeGlobals: ['cod', 'index']
});
