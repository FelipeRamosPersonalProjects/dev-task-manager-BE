const _Global = require('../maps/_Global');

class User extends _Global {
    constructor(setup = {
        ...this,
        auth_UID: '',
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        cellphone: '',
        birthdate: Date(),
        address: Object(),
        binanceConfig: BinanceConfig.prototype
    }){
        try {
            super({...setup, validationRules: 'users'});
    
            // Database exported properties
            this.auth_UID = setup.auth_UID;
            this.fullName = setup.fullName;
            this.firstName = setup.firstName;
            this.lastName = setup.lastName;
            this.email = setup.email;
            this.cellphone = setup.cellphone;
            this.birthdate = setup.birthdate;
            this.address = setup.address;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'User');
        }
    }
}

module.exports = User;
