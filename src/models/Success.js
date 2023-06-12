class Success {
    constructor(data, message) {
        this.success = true;
        this.data = data;
        this.message = message;
    }

    toJSON() {
        try {
            return JSON.stringify({...this});
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Success;
