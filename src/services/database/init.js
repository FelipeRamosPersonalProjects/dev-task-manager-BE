const mongoose = require('mongoose');
const configs = require('../../../config.json');
let dbName = 'dev-desk';

// Initializing collections
require('../../schemas');

if (configs.mode === 'development') {
    dbName = 'dev-desk-development';
}

module.exports = new Promise((resolve, reject) => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true, dbName }).then(connectedDB=>{
        console.log('>> Banco de dados conectado em: mongodb://localhost:27017/\n');
        // Globals
        global.initializedCollections = [];
        resolve(connectedDB)
    }).catch(err=>{
        console.error('Ocorreu um erro ao conectar no banco de dados: ', JSON.stringify(err, null, 3));
        reject(err);
    });
})
