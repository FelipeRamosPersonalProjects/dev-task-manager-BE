async function createCollectionModel(schemaName) {
    toolsCLI.print(`Creating new collection model...`, 'WORKING');

    try {
        const FS = require('@services/FS');
        const schemas = require(`@schemas/${schemaName}`);
        const camelName = schemaName.toCamelCase();
        let modelName = camelName || '';

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

module.exports = createCollectionModel;
