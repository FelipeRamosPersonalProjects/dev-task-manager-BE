const Validation = require('@models/collections/Validation');

class ValidationsClass {
    static Model = Validation;

    get frontURL() {
        return `/validations/read-edit/${this.index}`;
    }
}

module.exports = ValidationsClass;
