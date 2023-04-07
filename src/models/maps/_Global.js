const ValidateSchema = require('../../validation/validateSchema');
const CRUD = require('../../services/database/crud');
const config = require('../../../config.json');

class GlobalMap extends ValidateSchema {
    constructor(setup = {
        _id: String(),
        index: Number(),
        author: String(),
        cod: String(),
        createdAt: Date(),
        modifiedAt: Date()
    }, parent) {
        super(setup.validationRules || {});
        if (!setup.isComplete && !setup.isNew) return;

        try {
            this.isNew = setup.isNew;
            this._id = setup._id && setup._id.toString();
            this.index = setup.index;
            this.author = setup.author || config.testUser;
            this.cod = setup.cod;
            this.createdAt = setup.createdAt && new Date(setup.createdAt).toLocaleString();
            this.modifiedAt = setup.modifiedAt && new Date(setup.modifiedAt).toLocaleString();
    
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
        });

        return user.doc;
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
}

module.exports = GlobalMap;
