const _Global = require('../maps/_Global');

class Estimation extends _Global {
    constructor(setup){
        try {
            super({...setup, validationRules: 'estimations'}, this);
            if (!setup || isObjectID(setup)) return;
            const { displayName, frontURL } = setup || {};

            this.displayName = displayName;
            this.frontURL = frontURL;
            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Estimation');
        }
    }
}

module.exports = Estimation;
