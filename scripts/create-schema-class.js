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

        await appendToClassIndex({ newSchemaClassName: className });
        toolsCLI.print(`File "src/schemas/class/${className}.js" created successfully...`, 'SUCCESS');
        return schemaClass;
    } catch (err) {
        throw new Error.Log(err);
    }
}

async function appendToClassIndex({ newSchemaClassName }) {
    toolsCLI.print(`Building class file index...`, 'WORKING');

    try {
        const FS = require('@services/FS');
        const CRUD = require('@CRUD');
        const currentList = await CRUD.query({collectionName: 'counters'});
        const fileTemplate = Resource.templates('code.schemas_class_index', {newSchemaClassName, currentList});
        const fileString = fileTemplate.renderToString();
        
        toolsCLI.print(`File "src/schemas/class/index.js" updated successfully...`, 'SUCCESS');
        return await FS.writeFile('src/schemas/class/index.js', fileString);
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = createSchemaClass;
