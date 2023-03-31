class FormCtrlCLI {
    constructor(setup = {
        schema: {},
        exclude: []
    }, parent) {
        const { schema, exlude } = setup || {};

        this.schema = schema;
        this.exclude = exlude || ['_id', 'createdAt', 'modifiedAt', 'index', 'cod'];
        this.formData = schema ? this.buildFormData() : {};
        this.formFields = [];

        this.parent = () => parent;
    }

    setField(key, value) {
        this.formData[key] = value;
    }

    async startForm() {
        for (let i = 0; i < this.formFields.length; i++) {
            const currKey = this.formFields[i];
            const answer = await this.parent().prompt.question(currKey + ': ');
            
            if (answer) {
                this.setField(currKey, answer);
            }
        }
        return this.formData;
    }

    buildFormData() {
        const result = {};
        const schemaObj = this.schema && this.schema.obj;

        if (schemaObj) {
            Object.entries(schemaObj).map(([key, value]) => {
                if (!this.exclude.find(item => item === key)){
                    result[key] = value.default;
                    this.formFields.push(key);
                }
            });
        }

        this.formData = result;
        return result;
    }

    setSchema(schema) {
        if (schema) {
            this.schema = schema;
        }
    }

    setForm(schema) {
        this.setSchema(schema);
        this.buildFormData();
    }
}

module.exports = FormCtrlCLI;
