function preSave(next) {
    try {
        if (this.FE) this.FE = Date.convertToMillis(this.FE, this.unit);
        if (this.BE) this.BE = Date.convertToMillis(this.BE, this.unit);
        if (this.QA) this.QA = Date.convertToMillis(this.QA, this.unit);
        if (this.others) this.others = Date.convertToMillis(this.others, this.unit);

        next();
    } catch (err) {
        throw new Error.Log(err);
    }
}

async function preUpdate(next) {
    try {

        if (!this._update.unit) this._update.unit = 'HOUR';
        if (this._update.FE) this._update.FE = Date.convertToMillis(this._update.FE, this._update.unit);
        if (this._update.BE) this._update.BE = Date.convertToMillis(this._update.BE, this._update.unit);
        if (this._update.QA) this._update.QA = Date.convertToMillis(this._update.QA, this._update.unit);
        if (this._update.others) this._update.others = Date.convertToMillis(this._update.others, this._update.unit);

        next();
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    preSave,
    preUpdate
};
