const _Global = require('@models/maps/_Global');

class TestingStep extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'testing_steps'}, parent);
        if (!setup || isObjectID(setup)) return;

        const {
            /*## ModelParams_Start ##*/
            index,
            cod,
            createdAt,
            modifiedAt,
            author,
        } = Object(setup);
            /*## ModelParams_End ##*/
        
        try {
            /*## ModelProps_Start ##*/
            this.index = index;
            this.cod = cod;
            this.createdAt = createdAt;
            this.modifiedAt = modifiedAt;
            this.author = author;

            this.placeDefault();
            /*## ModelProps_End ##*/
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'TestingStep');
        }
    }
}

module.exports = TestingStep;
