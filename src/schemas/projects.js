const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const TemplateOptionsMap = require('./map/TemplatesOptions');

module.exports = new Schema({
    name: 'projects',
    symbol: 'PRJ',
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
            default: [],
            ref: 'tickets',
            refConfig: new Schema.RefConfig({
                relatedField: 'project',
                type: 'ObjectId'
            })
        },
        tasks: {
            type: [ObjectId],
            default: [],
            ref: 'tasks',
            refConfig: new Schema.RefConfig({
                relatedField: 'project',
                type: 'ObjectId'
            })
        },
        repos: {
            type: [ObjectId],
            default: [],
            ref: 'repos',
            refConfig: new Schema.RefConfig({
                relatedField: 'projects',
                type: 'array-oid'
            })
        },
        spaceDesk: {
            type: ObjectId,
            ref: 'space_desks',
            refConfig: new Schema.RefConfig({
                relatedField: 'projects',
                type: 'array-oid'
            })
        },
        organization: {
            type: ObjectId,
            ref: 'organizations',
            refConfig: new Schema.RefConfig({
                relatedField: 'projects',
                type: 'array-oid'
            })
        },
        templates: {
            type: TemplateOptionsMap,
            default: {}
        }
    }
});
