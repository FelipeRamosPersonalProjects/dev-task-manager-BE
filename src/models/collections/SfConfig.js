const _Global = require('@models/maps/_Global');
const Ticket = require('@models/collections/Ticket');
const Task = require('@models/collections/Task');

class SfConfig extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'sf_configs'}, parent);
        if (!setup || Object(setup).oid()) return;

        const {
            /*## ModelParams_Start ##*/
            type,
            customPreferenceType,
            configs,
            ticket,
            task,
        } = Object(setup);
            /*## ModelParams_End ##*/
        
        try {
            /*## ModelProps_Start ##*/
            this.type = type;
            this.customPreferenceType = customPreferenceType;
            this.configs = configs;
            this.ticket = !Object(ticket).oid() ? new Ticket(ticket) : null;
            this.task = !Object(task).oid() ? new Task(task) : null;

            this.placeDefault();
            /*## ModelProps_End ##*/
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'SfConfig');
        }
    }
}

module.exports = SfConfig;
