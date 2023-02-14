const Schema = require('../models/database/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'projects',
    symbol: 'PRJ',
    schema: {
        name: { type: SchemaTypes.String, required: true },
        description: { type: SchemaTypes.String, default: '' },
        links: { type: [Object], default: [] },
        tasks: { type: [Object], default: [] }
    }
});
