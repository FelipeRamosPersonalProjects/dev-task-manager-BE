const mongoose = require('mongoose');

// Globals
global.initializedCollections = [];

// Initializing collections
require('../../schemas');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true, dbName: 'dev-task-manager' }).then(connectedDB=>{
    console.log('>> Banco de dados conectado em: mongodb://localhost:27017/\n');
}).catch(err=>{
    console.error('Ocorreu um erro ao conectar no banco de dados: ', JSON.stringify(err, null, 3));
});
