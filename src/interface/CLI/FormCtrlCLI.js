class FormCtrlCLI {
    constructor(setup = {
        mode,
        schema: {},
        exclude: []
    }, parent) {
        const { mode, schema, exlude } = setup || {};

        this.mode = mode || 'create'; // 'edit' | 'create'
        this.schema = schema;
        this.exclude = exlude || ['_id', 'createdAt', 'modifiedAt', 'index', 'cod'];
        this.formFields = [];
        this.formData = {};

        if (schema) {
            this.setForm(schema);
        }

        this.parent = () => parent;
    }

    setField(key, value) {
        this.formData[key] = value;
    }

    buildFormData() {
        const result = {};
        const schemaObj = this.schema && this.schema.obj;

        if (schemaObj) {
            Object.entries(schemaObj).map(([key, value]) => {
                if (!this.exclude.find(item => item === key)){
                    if (this.mode === 'create') {
                        result[key] = value.default;
                    }
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

    getFieldSchema(path) {
        const parsedPath = path.split('.');
        let result = this.schema.obj;

        parsedPath.map(item => {
            if (result) result = result[item];
        });

        if (result) return result;
    }

    setForm(schema) {
        this.setSchema(schema);
        this.buildFormData();
    }
}

module.exports = FormCtrlCLI;
