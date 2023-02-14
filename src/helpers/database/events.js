const dbHelpers = require('./dbHelpers');
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
            const schemas = require('../../schemas');
            const selfSchema = schemas && schemas[collection];
            const links = selfSchema && selfSchema.links || {};
            const thisDoc = this;

            for (let link in links) {
                const linkedValue = thisDoc[link];
                const currLink = links[link];
                const relRef = schemas[collection].schema.obj[link].ref;

                if (Array.isArray(linkedValue)) {
                    // It's missing to finish here
                } else if (typeof linkedValue === 'object') {
                    const relSchema = schemas[relRef]
                    const relType = relSchema && schemas[relRef].schema && schemas[relRef].schema.obj[currLink];

                    if (relType && relType.type) {
                        if (Array.isArray(relType.type)) await relSchema.DB.findOneAndUpdate({_id: linkedValue}, {$addToSet: {[currLink]: thisDoc._id}});
                        else await relSchema.DB.findOneAndUpdate(linkedValue, {[currLink]: thisDoc._id});
                    }
                }
            }
        }
    } catch(err) {
        throw new Error.Log(err).append('database.events.post_save')
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
