const _Global = require('../maps/_Global');

class Estimation extends _Global {
    constructor(setup){
        try {
            super({...setup, validationRules: 'estimations'});
            if (!setup || isObjectID(setup)) return;
            const {  } = setup || {};

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Estimation');
        }
    }
}

module.exports = Estimation;
