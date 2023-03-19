const Schema = require('../models/collections/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'projects',
    symbol: 'PRJ',
    links: { tasks: 'project' },
    schema: {
        projectName: { type: SchemaTypes.String, required: true },
        description: { type: SchemaTypes.String, default: '' },
        urls: { type: [SchemaTypes.ObjectId], default: [] },
        tasks: { type: [SchemaTypes.ObjectId], default: [], ref: 'tasks' }
    }
});
