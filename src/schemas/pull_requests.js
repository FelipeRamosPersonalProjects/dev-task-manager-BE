const Schema = require('../models/database/SchemaDB');
const SchemaTypes = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'pull_requests',
    symbol: 'PR',
    schema: {
        prName: { type: SchemaTypes.String, required: true },
        prGitHubID: { type: SchemaTypes.String, required: true },
        description: { type: SchemaTypes.String },
        fileChanges: { type: [SchemaTypes.ObjectId], ref: 'files' },
        assignedUsers: { type: [SchemaTypes.ObjectId], ref: 'users' },
        reviewers: { type: [SchemaTypes.ObjectId], default: [], ref: 'users' },
        labels: { type: [String] },
        bmConfigs: { type: [SchemaTypes.ObjectId], default: [], ref: 'bm_configs' },
        comments: { type: [SchemaTypes.ObjectId], default: [], ref: 'comments' }
    }
});
