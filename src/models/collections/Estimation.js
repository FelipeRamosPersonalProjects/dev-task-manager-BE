const _Global = require('../maps/_Global');

class Estimation extends _Global {
    constructor(setup){
        try {
            if (!setup || isObjectID(setup)) return;
            super({...setup, validationRules: 'estimations'});
            const {  } = setup || {};

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Estimation');
        }
    }
}

module.exports = Estimation;
