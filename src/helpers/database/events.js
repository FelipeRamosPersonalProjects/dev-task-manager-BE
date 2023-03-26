const dbHelpers = require('./dbHelpers');
const relationalHelper = require('./relationalFields');
const config = require('../../../config.json');

async function preSave(next) {
    try {
        const collection = this.collection.collectionName;

        if (collection !== config.database.counterCollection) {
            const counter = await dbHelpers.increaseCounter(collection);
            
            // Incrementing the index field
            if(counter) {
                const count = counter.value;
                const symbol = counter.symbol;

                this.index = count;
                this.cod = symbol + count;
            } else {
                throw new Error.Log('database.counter_not_found', collection);
            }

            next();
        }
    } catch(err) {
        throw new Error.Log(err).append('database.events.pre_save');
    }
}

async function preUpdateOne(next) {
    // Updating the modifiedAt timestamp
    this._update.modifiedAt = Date.now();
    next();
}

async function postSave() {
    try {
        const collection = this.collection.collectionName;

        if (collection !== config.database.counterCollection) {
            await relationalHelper.onCreate.call(this);
        }

        return;
    } catch(err) {
        throw new Error.Log(err).append('database.events.post_save');
    }
}

async function postDelete() {
    try {
        const collection = this._collection.collectionName;
        const schemas = require('../../schemas');
        const CRUD = require('../../services/database/crud');
        const deletedUID = this._conditions._id.toString();

        for (let key in schemas) {
            const currSchema = schemas[key].schema;
            const paths = currSchema.paths;

            for (let path in paths) {
                const currPath = paths[path];
                const ref = currPath.options.ref;

                if (ref === collection) {
                    const type = currPath.options.type;

                    if (Array.isArray(type) && type.length) {
                        const updated = await CRUD.update({
                            type: 'many',
                            collectionName: key,
                            filter: { [path]: { $elemMatch: { $eq: deletedUID } }},
                            data: { $pull: {[path]: deletedUID}}
                        });
                        
                        if(!updated.acknowledged) throw new Error.Log('database.events.post_delete_not_acknowledged');
                        return updated;
                    } else {
                        const updated = await CRUD.update({
                            type: 'many',
                            collectionName: key,
                            filter: { [path]: deletedUID },
                            data: { [path]: null }
                        });
                        if(!updated.acknowledged) throw new Error.Log('database.events.post_delete_not_acknowledged');
                        return updated;
                    }
                }
            };
        }
    } catch(err) {
        throw new Error.Log('database.events.post_delete');
    }
}

module.exports = {
    preSave,
    preUpdateOne,
    postSave,
    postDelete
};
