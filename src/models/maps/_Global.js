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

        try {
            this._id = setup._id && setup._id.toString();
            this._id = setup._id;
            this.index = setup.index;
            this.author = setup.author;
            this.cod = setup.cod;
            this.createdAt = setup.createdAt;
            this.modifiedAt = setup.modifiedAt;
    
            this.getParent = () => parent;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GlobalMap;
