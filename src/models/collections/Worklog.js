const _Global = require('@models/maps/_Global');
const Logstamp = require('@models/maps/Logstamp');

class Worklog extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'worklogs'}, parent);
        if (!setup || isObjectID(setup)) return;

        const {
            status,
            startTime,
            endTime,
            summedTime,
            description,
            logstamps
        } = Object(setup);
        
        try {
            this.status = status;
            this.startTime = startTime;
            this.endTime = endTime;
            this.summedTime = summedTime;
            this.description = description;
            this.logstamps = Array.isArray(logstamps) && logstamps.map(item => new Logstamp(item));

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Worklog');
        }
    }
}

module.exports = Worklog;
