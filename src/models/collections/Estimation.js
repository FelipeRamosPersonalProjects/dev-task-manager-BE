const _Global = require('../maps/_Global');

class Estimation extends _Global {
    constructor(setup = {
        ...Estimation.prototype,
    }){
        try {
            super({...setup, validationRules: 'estimations'});
            if (!setup.isComplete) return;
            const {  } = setup || {};

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Estimation');
        }
    }
}

module.exports = Estimation;
