const ValidateSchema = require('../../validation/validateSchema');

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
        if (!setup.isComplete) return;

        try {
            this._id = setup._id && setup._id.toString();
            this.index = setup.index;
            this.author = setup.author;
            this.cod = setup.cod;
            this.createdAt = new Date(setup.createdAt).toLocaleString();
            this.modifiedAt = new Date(setup.modifiedAt).toLocaleString();
    
            this.getParent = () => parent;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GlobalMap;
