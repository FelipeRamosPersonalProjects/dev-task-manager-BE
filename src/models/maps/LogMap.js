class LogBase {
    constructor({
        status,
        type,
        name,
        message,
        resource
    }) {
        this.status = status;
        this.type = type || 'log';
        this.name = name;
        this.message = message;
        this.resource = resource;
    }

    notify() {}

    emailNotify() {}
}

module.exports = LogBase;
