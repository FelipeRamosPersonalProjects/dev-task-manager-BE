require('module-alias/register');
// Declaring globals
require('@global');

let collectionName;

// Initializing MongoDB
require('@services/database/init').then(async () => {
    async function createCollection() {
        toolsCLI.print(`Starting to create a new collection...`, 'WORKING');

        try {
            const schema = await createSchema();
            const schemaClass = await createSchemaClass(schema.name);
            const collectionModel = await createCollectionModel(schema.name);
            const schemaAppended = await appendToSchemaIndex(schema.name);
            const classAppended = await appendToClassIndex({
                newSchema: collectionName || '',
                newSchemaClassName: schemaClass.modelName
            });

            const success = [
                schema.success,
                schemaClass.success,
                collectionModel.success,
                schemaAppended.success,
                classAppended.success,
            ].every(item => item);

            if (success) {
                return success.toSuccess();
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async function createSchema() {
        toolsCLI.print(`Creating new schema file...`, 'WORKING');

        try {
            const FS = require('@services/FS');
            const [schemaName, symbol] = process.argv.slice(2);
            
            if (!schemaName || !symbol) {
                throw new Error.Log('common.missing_params', ['schemaName', 'symbol']);
            }

            collectionName = schemaName && schemaName.toLowerCase();
            if (!collectionName.endsWith('s')) {
                collectionName += 's';
            }

            const symbolParsed = symbol && symbol.toUpperCase();
            const fileCodeTemplate = Resource.templates('code.schema_file', {
                name: collectionName,
                key: symbolParsed,
            });
            const fileCodeString = fileCodeTemplate.renderToString();
            const schema = await FS.writeFile(`src/schemas/${collectionName}.js`, fileCodeString);
            if (schema instanceof Error.Log) {
                throw schema;
            }

            schema.name = collectionName;
            toolsCLI.print(`File "src/schemas/${collectionName}.js" created successfully...`, 'SUCCESS');
            return schema;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async function createSchemaClass(schemaName) {
        toolsCLI.print(`Creating new schema class...`, 'WORKING');

        try {
            const camelName = schemaName.toCamelCase();
            let modelName = camelName || '';
            const className = modelName + 'Class';

            if (!className || !modelName) {
                throw new Error.Log('common.missing_params', ['className', 'modelName']);
            }

            if (modelName.endsWith('s')) {
                modelName = modelName.slice(0, modelName.length-1);
            }

            const FS = require('@services/FS');
            const fileCodeTemplate = Resource.templates('code.schema_class_file', {className, modelName});
            const fileCodeString = fileCodeTemplate.renderToString();

            const schemaClass = await FS.writeFile(`src/schemas/class/${className}.js`, fileCodeString);
            if (schemaClass instanceof Error.Log) {
                throw schemaClass;
            }

            
            schemaClass.modelName = modelName;
            schemaClass.className = className;

            toolsCLI.print(`File "src/schemas/class/${className}.js" created successfully...`, 'SUCCESS');
            return schemaClass;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async function createCollectionModel(schemaName) {
        toolsCLI.print(`Creating new collection model...`, 'WORKING');

        try {
            const FS = require('@services/FS');
            const schemas = require(`@schemas/${schemaName}`);
            const camelName = schemaName.toCamelCase();
            let modelName = camelName || '';
            let currentSchema;

            if (!schemas) {
                throw Error.Log({
                    name: 'NEW-SCHEMA-NOT-SET',
                    message: `Your're trying to create a new schema, but it wasn't configured properly! Check the schema object declaration...`
                });
            }

            if (!modelName) {
                throw new Error.Log('common.missing_params', ['modelName']);
            }

            if (modelName.endsWith('s')) {
                modelName = modelName.slice(0, modelName.length-1);
            }

            const fileCodeTemplate = Resource.templates('code.collection_model_file', {
                modelName,
                collectionName: schemaName,
                schemaObj: schemas.getSafe('schema.obj')
            });
            const fileCodeString = fileCodeTemplate.renderToString();

            const collectionModel = await FS.writeFile(`src/models/collections/${modelName}.js`, fileCodeString);
            if (collectionModel instanceof Error.Log) {
                throw collectionModel;
            }

            toolsCLI.print(`File "src/models/collections/${modelName}.js" created successfully...`, 'SUCCESS');
            return collectionModel;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async function appendToSchemaIndex(newSchema) {
        toolsCLI.print(`Building schema file index...`, 'WORKING');

        try {
            const FS = require('@services/FS');
            const CRUD = require('@CRUD');
            const currentList = await CRUD.query({collectionName: 'counters'});
            const fileTemplate = Resource.templates('code.schemas_index', {newSchema, currentList});
            const fileString = fileTemplate.renderToString();
            
            toolsCLI.print(`File "src/schemas/index.js" updated successfully...`, 'SUCCESS');
            return await FS.writeFile('src/schemas/index.js', fileString);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async function appendToClassIndex({ newSchema, newSchemaClassName }) {
        toolsCLI.print(`Building class file index...`, 'WORKING');

        try {
            const FS = require('@services/FS');
            const CRUD = require('@CRUD');
            const currentList = await CRUD.query({collectionName: 'counters'});
            const fileTemplate = Resource.templates('code.schemas_class_index', {newSchema, newSchemaClassName, currentList});
            const fileString = fileTemplate.renderToString();
            
            toolsCLI.print(`File "src/schemas/class/index.js" updated successfully...`, 'SUCCESS');
            return await FS.writeFile('src/schemas/class/index.js', fileString);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    try {
        const created = await createCollection();
        schemas = require(`@schemas/${collectionName}`);

        toolsCLI.print(`Collection "${collectionName}" created!`, 'SUCCESS');
        return created;
    } catch (err) {
        throw new Error.Log(err);
    }
}).catch(err => {
    new Error.Log(err).consolePrint();
});
