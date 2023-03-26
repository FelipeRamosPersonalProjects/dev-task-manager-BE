async function onCreate() {
    const promises = [];

    try {
        // Iterate each field of the current document being created
        Object.entries(this.schema.obj).map(([key, value]) => {
            if (!value.refConfig || !this[key]) return;
    
            const currType = value.type;
            const {relatedField, type} = value.refConfig;
            const isCurrentAnArray = (Array.isArray(currType) && currType.length && currType[0].schemaName === 'ObjectId');
            const isCurrentAnObjectId = (currType.schemaName === 'ObjectId');
            const isRelatedAnArray = (type === 'array-oid');
            const isRelatedAnObjectId = (type === 'ObjectId');
    
            if (isCurrentAnArray && !this[key].length) {
                return;
            }
    
            if (isCurrentAnArray && isRelatedAnArray) {
                const toUpdate = new Promise((resolve, reject) => {
                    this.model(value.ref).updateMany(
                        { _id: { $in: [...this[key]] } },
                        { $addToSet: { [relatedField]: this.id } },
                        (err, result) => {
                            if (err) return reject(new Error.Log(err));
                            return resolve(result);
                        }
                    );
                });
    
                promises.push(toUpdate);
            }
    
            if (isCurrentAnArray && isRelatedAnObjectId) {
                const toUpdate = new Promise((resolve, reject) => {
                    this.model(value.ref).updateMany(
                        { _id: { $in: [...this[key]] } },
                        { [relatedField]: this.id },
                        (err, result) => {
                            if (err) return reject(new Error.Log(err));
                            return resolve(result);
                        }
                    );
                });
    
                promises.push(toUpdate);
            }
    
            if (isCurrentAnObjectId && isRelatedAnArray) {
                const toUpdate = this.model(value.ref).findOneAndUpdate({ _id: this[key].toString() }, {$addToSet: { [relatedField]: this.id }});
                promises.push(toUpdate);
            }
    
            if (isCurrentAnObjectId && isRelatedAnObjectId) {
                const toUpdate = this.model(value.ref).findOneAndUpdate({ _id: this[key].toString() }, { [relatedField]: this.id });
                promises.push(toUpdate);
            }
        });
    
        const updated = await Promise.all(promises);
        return updated;
    } catch(err) {
        throw new Error.Log(err);
    }
}

async function onDelete() {
    try {
        const filter = this.getFilter();
        const currentDoc = await this.model.findOne(filter);
        const promises = [];
    
        if (!currentDoc) {
            return;
        }

        // Iterate each field of the current document being deleted
        Object.entries(this.schema.obj).map(([key, value]) => {
            if (!value.refConfig) return;
    
            const currType = value.type;
            const {relatedField, type} = value.refConfig;
            const isCurrentAnArray = (Array.isArray(currType) && currType.length && currType[0].schemaName === 'ObjectId');
            const isCurrentAnObjectId = (currType.schemaName === 'ObjectId');
            const isRelatedAnArray = (type === 'array-oid');
            const isRelatedAnObjectId = (type === 'ObjectId');
    
            if (isCurrentAnArray && isRelatedAnArray) {
                const toUpdate = new Promise((resolve, reject) => {
                    this.model.db.model(value.ref).updateMany(
                        { _id: { $in: [...currentDoc[key]] } },
                        { $pull: { [relatedField]: this._conditions._id } },
                        (err, result) => {
                            if (err) return reject(new Error.Log(err));
                            return resolve(result);
                        }
                    );
                });
    
                promises.push(toUpdate);
            }
    
            if (isCurrentAnArray && isRelatedAnObjectId) {
                const toUpdate = new Promise((resolve, reject) => {
                    this.model.db.model(value.ref).updateMany(
                        { _id: { $in: [...currentDoc[key]] } },
                        { [relatedField]: undefined },
                        (err, result) => {
                            if (err) return reject(new Error.Log(err));
                            return resolve(result);
                        }
                    );
                });
    
                promises.push(toUpdate);
            }
    
            if (isCurrentAnObjectId && isRelatedAnArray) {
                const toUpdate = this.model.db.model(value.ref).updateOne(
                    { _id: currentDoc[key].toString() },
                    { $pull: { [relatedField]: this._conditions._id } }
                );
                promises.push(toUpdate);
            }
    
            if (isCurrentAnObjectId && isRelatedAnObjectId) {
                const toUpdate = this.model.db.model(value.ref).findOneAndUpdate(
                    { _id: currentDoc[key].toString() },
                    {[relatedField]: undefined }
                );
                promises.push(toUpdate);
            }
        });

        const updated = await Promise.all(promises);
        return updated;
    } catch(err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    onCreate,
    onDelete
}