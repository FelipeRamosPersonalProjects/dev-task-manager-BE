const mongoose = require('mongoose');

function getGlobalSchema(exclude) {
    const out = {...getGlobalSchema.standardGlobal};

    if (exclude && Array.isArray(exclude)) {
        exclude.map(prop=>{
            if (out[prop]) {
                delete out[prop];
            }
        });
    }

    return out;
}
getGlobalSchema.standardGlobal = {
    index: { type: mongoose.Schema.Types.Number, unique: true, immutable: true },
    cod: { type: mongoose.Schema.Types.String, unique: true, immutable: true },
    createdAt: { type: mongoose.Schema.Types.Date, immutable: true, default: Date.now },
    modifiedAt: { type: mongoose.Schema.Types.Date, default: Date.now }
}

module.exports = {
    getGlobalSchema
};
