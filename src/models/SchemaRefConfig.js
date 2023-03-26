class SchemaRefConfig {
    constructor(setup = {
        relatedField: '',
        type
    }) {
        const {relatedField, type} = setup || {};

        this.relatedField = relatedField;
        this.type = type;
    }
}

module.exports = SchemaRefConfig;
