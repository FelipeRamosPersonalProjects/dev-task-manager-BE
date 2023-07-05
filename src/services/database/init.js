const mongoose = require('mongoose');
const Configs = require('@config');
const checkForSchema = require('@scripts/checkSchemaModifications');
let dbName = 'dev-desk-development';

// Initializing collections
const schemas = require('@schemas');

if (Configs.mode === 'production') {
    dbName = 'dev-desk';
}

if (Configs.mode === 'STG') {
    dbName = 'dev-desk-STG';
}

module.exports = new Promise((resolve, reject) => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true, dbName }).then(async (connectedDB) => {
        console.log('>> Banco de dados conectado em: mongodb://localhost:27017/\n');

        // Globals
        global.initializedCollections = [];

        // Check for collection schemas modifications and updating them
        await checkForSchema(schemas);

        resolve(connectedDB);
    }).catch(err=>{
        console.error('Ocorreu um erro ao conectar no banco de dados: ', JSON.stringify(err, null, 2));
        reject(err);
    });
})
