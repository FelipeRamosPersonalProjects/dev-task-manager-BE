const SchemaFile = require('./SchemaFile');
const SchemaClassFile = require('./SchemaClassFile');
const CollectionModel = require('./CollectionModel');
const SchemaIndex = require('./SchemasIndex');
const SchemaClassIndex = require('./SchemaClassIndex');

module.exports = {
    schema_file: (params) => {
        return new SchemaFile({
            componentName: `Project's Schema File`,
            description: `To create project's schema files standardized`,
            ...params
        });
    },

    schema_class_file: (params) => {
        return new SchemaClassFile({
            componentName: `Project's Schema Class File`,
            description: `To create project's schema class files standardized`,
            ...params
        });
    },

    collection_model_file: (params) => {
        return new CollectionModel({
            componentName: `Collection Mode Code File`,
            description: `To create project's collection model files standardized`,
            ...params
        });
    },

    schemas_index: (params) => {
        return new SchemaIndex({
            componentName: `Schema Index File`,
            description: `Generates the schema index file.`,
            ...params
        });
    },

    schemas_class_index: (params) => {
        return new SchemaClassIndex({
            componentName: `Schema Class Index File`,
            description: `Generates the schema classes index file.`,
            ...params
        });
    }
};
