const _Global = require('../maps/_Global');

class SpaceDesk extends _Global {
    constructor(setup = {
        ...SpaceDesk.prototype,
    }){
        try {
            super({...setup, validationRules: 'space_desks'});
            const { spaceName, owner } = setup || {};

            this.spaceName = spaceName;
            this.owner = owner;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'SpaceDesk');
        }
    }
}

module.exports = SpaceDesk;
