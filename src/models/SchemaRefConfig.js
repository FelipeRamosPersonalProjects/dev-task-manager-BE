class SchemaRefConfig {
    constructor(setup = {
        type,
        relatedField: '',
        toDelete: false
    }) {
        const {relatedField, type, toDelete} = setup || {};

        this.type = type;
        this.relatedField = relatedField;
        this.toDelete = Boolean(toDelete);
    }
}

module.exports = SchemaRefConfig;
