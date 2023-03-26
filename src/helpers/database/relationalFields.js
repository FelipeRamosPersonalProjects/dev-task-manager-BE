async function onCreate() {
    const promises = [];

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
            debugger
        }

        if (isCurrentAnObjectId && isRelatedAnArray) {
            const toUpdate = this.model(value.ref).findOneAndUpdate({ _id: this[key].toString() }, {$addToSet: { [relatedField]: this.id }});
            promises.push(toUpdate);
        }

        if (isCurrentAnObjectId && isRelatedAnObjectId) {
            debugger
        }
    });

    const updated = await Promise.all(promises);
    return updated;
}

module.exports = {
    onCreate
}