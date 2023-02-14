class GlobalClass {
    initialize() {
        try {
            const Model = this.schema && this.schema.statics && this.schema.statics.BSModel;
            if(Model) {
                const builded = new Model(this.toObject(), this.master);
                return builded;
            } else {
                return this;
            }
        } catch(err) {
            throw new Error.Log(err).append('database.init_document', this.collection.collectionName, this.id);
        }
    }
}

module.exports = GlobalClass;
