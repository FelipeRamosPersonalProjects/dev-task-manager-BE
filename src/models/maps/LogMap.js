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

    suspendSlot() {}

    async stopSlot(slot) {
        try {
            if (!Boolean.isValid(slot).objectFilled()) this.slot = slot;
            if (!Boolean.isValid(slot).path('UID').stringFilled()) return;
    
            return await botRunner.turnOffSlot(slot.UID, true);
        } catch(err) {
            this.emailNotify();
            throw new Error.Log(err).append('botRunner.error_during_emergency_stop', slot.cod, slot.name);
        }
    }
}

module.exports = LogBase;
