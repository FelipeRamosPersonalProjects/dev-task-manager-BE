class LogBase {
    constructor({
        type,
        name,
        message,
        resource,
        slot,
        position,
        master
    }) {
        this.type = type || 'log';
        this.name = name;
        this.message = message;
        this.resource = resource;
        this.slot = slot;
        this.position = position;
        this.master = master;
    }

    notify() {}

    emailNotify() {}
}

module.exports = LogBase;
