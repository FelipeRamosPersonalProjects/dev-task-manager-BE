const Schema = require('../models/database/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'tasks',
    symbol: 'TSK',
    links: { project: 'tasks' },
    schema: {
        project: { type: SchemaTypes.ObjectId, ref: 'projects' }
    }
});
