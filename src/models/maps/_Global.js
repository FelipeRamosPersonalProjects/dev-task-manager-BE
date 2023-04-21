const ValidateSchema = require('../../validation/validateSchema');
const CRUD = require('../../services/database/crud');
const config = require('../../../config.json');
const { isObjectID } = require('../../helpers/database/relationalFields');
const { increaseDocProp } = require('../../helpers/database/dbHelpers');

class GlobalMap extends ValidateSchema {
    constructor(setup = {
        _id: String(),
        index: Number(),
        author: String(),
        cod: String(),
        createdAt: Date(),
        modifiedAt: Date(),
        collectionName: String()
    }, parent) {
        if (isObjectID(setup)) return;
        super(setup.validationRules || {});
        const { _id, index, author, cod, createdAt, modifiedAt, collectionName} = setup || {};

        try {
            this.collectionName = collectionName;
            this._id = _id && _id.toString();
            this.index = index;
            this.author = author || config.testUser;
            this.cod = cod;
            this.createdAt = createdAt && new Date(createdAt).toLocaleString();
            this.modifiedAt = modifiedAt && new Date(modifiedAt).toLocaleString();
    
            this.getParent = () => parent;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async getCurrentUser() {
        const UID = config.testUser;
        const user = await CRUD.getDoc({
            collectionName: 'users',
            filter: UID
        }).initialize();

        return user;
    }

    async saveDB(collectionName) {
        try {
            const created = await CRUD.create(collectionName, {...this});

            if (created instanceof Error.Log) {
                return new Error.Log(created);
            }

            if (created) {
                Object.entries(created.initialize() || {}).map(([key, value]) => {
                    this[key] = value;
                });
    
                return this;
            }

            throw new Error.Log(created);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async loadDB(collectionName) {
        try {
            const loaded = await CRUD.getDoc({collectionName, filter: this._id});
            
            if (loaded instanceof Error.Log) {
                throw new Error.Log(loaded);
            }

            return loaded.initialize();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async updateDB({collectionName, data}) {
        const collection = collectionName || this.collectionName;

        try {
            if (!collection) throw new Error.Log('database.missing_params', 'collectionName', '_Global.updateDB');

            const loaded = await CRUD.update({collectionName: collection, filter: this._id, data });
            if (loaded instanceof Error.Log) {
                throw new Error.Log(loaded);
            }

            return loaded;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async increaseProp(propKey, value) {
        if (!propKey) throw new Error.Log()
        const increaseValue = {[propKey]: value || 1};

        try {
            if (!this.collectionName || !propKey) {
                return new Error.Log('database.missing_params', ['this.collectionName', 'propKey'], '_Global.updateDB')
            }

            const increased = await increaseDocProp(this.collectionName, {_id: this._id}, increaseValue);
            if (increased instanceof Error.Log) {
                return increased;
            }

            return increased;
        } catch (err) {
            throw new Error.Log('helpers.increase_doc_prop', this.collectionName, this._id, increaseValue);
        }
    }
}

module.exports = GlobalMap;
