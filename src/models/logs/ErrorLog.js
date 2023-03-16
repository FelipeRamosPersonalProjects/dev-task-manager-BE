const {increaseLog} = require('../../helpers/database/dbHelpers');

class LogBase {
    static warn = (setup = LogBase.prototype) => {
        return new LogBase({...setup, type: 'warn'});
    }

    constructor({
        type,
        name,
        message,
        resource,
        slot,
        position,
        master,
        additionalData
    }) {
        this.type = type || 'log';
        this.name = name;
        this.message = message;
        this.resource = resource;
        this.slot = slot;
        this.position = position;
        this.master = master;

        if (typeof additionalData === 'string') {
            this.additionalData = JSON.parse(additionalData);
        } else if (typeof additionalData === 'string' && !Array.isArray(additionalData)) {
            this.additionalData = additionalData;
        }
    }

    notify() {}

    emailNotify() {}

    suspendSlot() {}

    async saveLog() {
        const schemas = require('../../schemas');
        const {name, message, type, resource, _id} = Logger.lastLogSaved || {};
        const isTheSame = [
            (this.type === type),
            (this.name === name),
            (this.message === message),
            (this.resource === resource)
        ].every(item => item);

        if (isTheSame) {
            try {
                _id && await increaseLog(_id.toString());
                return this;
            } catch(err) {
                throw Resource.error('logs.duplicated_log');
            }
        } else {
            try {
                const newLog = new schemas.logs.DB({
                    type: this.type,
                    name: this.name,
                    message: this.message,
                    resource: this.resource,
                    stack: this.stack,
                    errorList: JSON.stringify(this.errorList || []),
                    validationErrors: JSON.stringify(this.validationErrors || []),
                    slot: this.slot && (this.slot.UID || this.slot._id) || this.slot,
                    position: this.position && (this.position.UID || this.position._id) || this.position,
                    master: this.master && (this.master.UID || this.master._id) || this.master,
                    additionalData: JSON.stringify(
                        typeof this.additionalData === 'object' && !Array.isArray(this.additionalData) ? 
                        this.additionalData : {}
                    )
                });
                const saved = await newLog.save();
    
                Logger.lastLogSaved = saved.toObject();
                return this;
            } catch(err) {
                throw Resource.error('database.saving_log', err.name, err.message);
            }
        }
        
    }

    async stopSlot(slotUID) {
        try {
            if (!Boolean.isValid(slotUID).stringFilled()) {
                throw new Error.Log('common.bad_format_param', 'slotUID', 'LogBase.stopSlot()', 'slot UID (string)', slotUID, 'LogBase.js');    
            }

            return await botRunner.turnOffSlot(slotUID, true);
        } catch(err) {
            this.emailNotify();
            throw new Error.Log(err).append('botRunner.error_during_emergency_stop', slotUID);
        }
    }
}

module.exports = LogBase;
