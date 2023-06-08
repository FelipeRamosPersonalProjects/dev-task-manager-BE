const _Global = require("../maps/_Global");

class Label extends _Global {
    constructor(setup) {
        super({...setup, validationRules: 'labels'}, () => this);
        if (!setup || setup.oid()) return;

        try {
            const { name, slug } = Object(setup);

            this.name = name;
            this.slug = slug;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Label;
