const FS = require('@services/FS');
const Config = require('@config');
const createCollectionModel = require('./create-collection-model');
const createSchemaClass = require('./create-schema-class');
const Collection = require('@Collection');
const JSON_FILE_PATH = 'configs/collections.json';

async function getSchemaRegister() {
    try {
        const isJSONFileExist = FS.isExist(JSON_FILE_PATH);

        if (!isJSONFileExist) {
            return await FS.writeJSON(JSON_FILE_PATH, { schemas: {} });
        }

        const jsonFile = FS.readFileSync(JSON_FILE_PATH);
        return JSON.parse(jsonFile);
    } catch (err) {
        new Error.Log(err);
    }
}

async function updateDifferences(schemas, register) {
    try {
        const memoryFile = JSON.stringify(register);

        for (let key in schemas) {
            const lastSchema = register.schemas[key];

            if (!lastSchema) {
                const jsFile = FS.readFileSync('src/schemas/' + key + '.js');
                register.schemas[key] = jsFile;
            }

            const isCollModelExist = await isCollectionModelExist(key);

            if ([
                (schemas[key] instanceof Collection),
                (!isCollModelExist),
                (key !== 'counters'),
                (key !== 'logs'),
                (key !== 'stashes'),
            ].every(item => item)) {
                await createCollectionModel(key);
                await createSchemaClass(key);
            }
        };
        
        if (memoryFile !== JSON.stringify(register)) {
            return await FS.writeJSON(JSON_FILE_PATH, register);
        }
    } catch (err) {
        new Error.Log(err);
    }
}

async function isCollectionModelExist(collectionaName) {
    if (Config.database.counterCollection === collectionaName) {
        return;
    }

    try {
        collectionaName = collectionaName.slice(0, -1).split('_').map(item => {
            return item.charAt(0).toUpperCase() + item.slice(1);
        }).join('');

        return FS.isExist('src/models/collections/' + collectionaName + '.js');
    } catch (err) {
        throw new Error.Log(err);
    }
}

async function checkSchemaModifications(schemas) {
    try {
        const schemaRegister = await getSchemaRegister(schemas);
        const updated = await updateDifferences(schemas, schemaRegister);

        return updated;
    } catch (err) {
        new Error.Log(err);
    }
}

module.exports = checkSchemaModifications;
