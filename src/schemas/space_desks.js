const Schema = require('../models/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;
const TemplateOptionsMap = require('./map/TemplatesOptions');

module.exports = new Schema({
    name: 'space_desks',
    symbol: 'SPDK',
    schema: {
        spaceName: {
            type: String,
            required: true
        },
        owner: {
            type: ObjectId,
            ref: 'users',
            refConfig: new Schema.RefConfig({
                relatedField: 'spaceDesks',
                type: 'array-oid'
            })
        },
        projects: {
            type: [ObjectId],
            default: [],
            ref: 'projects',
            refConfig: new Schema.RefConfig({
                relatedField: 'spaceDesks',
                type: 'array-oid'
            })
        },
        templates: {
            type: TemplateOptionsMap,
            default: {}
        }
    }
});
