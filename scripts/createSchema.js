require('module-alias/register');
// Declaring globals
require('@global');

// Initializing MongoDB
require('@services/database/init').then(async () => {
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
                symbol: symbolParsed,
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

    const created = await createSchema();
    const indexed = await appendToSchemaIndex(created.name);

    return {
        created,
        indexed
    }
}).catch(err => {
    throw err;
});
