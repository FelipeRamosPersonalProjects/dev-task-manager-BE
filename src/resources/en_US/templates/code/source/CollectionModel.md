const _Global = require('@models/maps/_Global');

class ##{{modelName:string}}## extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: '##{{collectionName:string}}##'}, parent);
        if (!setup || isObjectID(setup)) return;

        const ##{{objectProps:array:ObjectPropNoValue}}## = Object(setup);
        
        try {
            ##{{objectProps:array:ThisDeclaration}}##
            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', '##{{modelName:string}}##');
        }
    }
}

module.exports = ##{{modelName:string}}##;
