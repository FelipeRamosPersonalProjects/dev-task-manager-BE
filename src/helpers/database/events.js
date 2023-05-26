const dbHelpers = require('./dbHelpers');
const relationalHelper = require('./relationalFields');
const config = require('@config');

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
    try {
        const collection = this._collection.collectionName;

        // Updating the modifiedAt timestamp
        this._update.modifiedAt = Date.now();
        
        if (!this._update.onlyAct && collection !== config.database.counterCollection) {
            await relationalHelper.onUpdate.call(this);
        }

        next();
    } catch(err) {
        throw new Error.Log(err).append('database.events.post_save');
    }
}

async function postUpdateOne() {
    try {
        const collection = this.model.modelName;
        const $set = this._update.$set;

        if ($set.status) {
            process.emit(`status:transition:${collection}`, this);
        }
    } catch (err) {
        throw new Error.Log(err);
    }
}

async function postSave() {
    try {
        const collection = this.collection.collectionName;

        if (collection !== config.database.counterCollection) {
            await relationalHelper.onCreate.call(this);
            process.emit(`create:${collection}`, this);
        }

        return;
    } catch(err) {
        throw new Error.Log(err).append('database.events.post_save');
    }
}

async function preDelete(next) {
    try {
        const collection = this._collection.collectionName;

        if (collection !== config.database.counterCollection) {
            await relationalHelper.onDelete.call(this);
        }
        
        next();
    } catch(err) {
        throw new Error.Log('database.events.pre_delete');
    }
}

async function postDelete() {
    try {
        return;
    } catch(err) {
        throw new Error.Log('database.events.post_delete');
    }
}

module.exports = {
    preSave,
    preUpdateOne,
    postUpdateOne,
    postSave,
    preDelete,
    postDelete
};
