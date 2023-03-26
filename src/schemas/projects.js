const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'projects',
    symbol: 'PRJ',
    links: {
        tasks: 'project',
        repos: 'projects',
        tickets: 'project',
        spaceDesks: 'projects'
    },
    schema: {
        projectName: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        urls: {
            type: Array,
            default: []
        },
        tickets: {
            type: [ObjectId],
            ref: 'tickets'
        },
        tasks: {
            type: [ObjectId],
            default: [],
            ref: 'tasks'
        },
        repos: {
            type: [ObjectId],
            default: true,
            ref: 'repos'
        },
        spaceDesks: {
            type: [ObjectId],
            default: [],
            ref: 'space_desks'
        }
    }
});
