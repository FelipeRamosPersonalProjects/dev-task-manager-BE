const Schema = require('../models/database/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'tasks',
    symbol: 'TSK',
    links: { project: 'tasks' },
    schema: {
        taskName: { type: SchemaTypes.String, required: true },
        taskCod: { type: SchemaTypes.String },
        description: { type: SchemaTypes.String },
        notes: { type: [SchemaTypes.ObjectId], default: [] },
        project: { type: SchemaTypes.ObjectId, ref: 'projects' },
        assignedUser: { type: SchemaTypes.ObjectId, ref: 'users' },
        tickets: { type: [SchemaTypes.ObjectId], default: [] },
        dueDate: { type: SchemaTypes.Date },
        sharedWith: { type: SchemaTypes.String },
        pullRequests: { type: [SchemaTypes.ObjectId], default: [] },
        configs: { type: [Object], default: [] }
    }
});
