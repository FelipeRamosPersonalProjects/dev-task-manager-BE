const Schema = require('../models/collections/SchemaDB');
const { ObjectId } = Schema.mongoSchema.Types;

module.exports = new Schema({
    name: 'space_desks',
    symbol: 'SPDK',
    links: {
        owner: 'spaceDesks',
        projects: 'spaceDesks'
    },
    schema: {
        spaceName: {
            type: String,
            required: true
        },
        owner: {
            type: ObjectId,
            ref: 'users',
            required: true
        },
        projects: {
            type: [ObjectId],
            default: [],
            ref: 'projects'
        }
    }
});
