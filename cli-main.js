const CLI = require('./src/interface/CLI');

// Declaring globals
require('./src/global');
// Initializing MongoDB
require('./src/services/database/init').then(async (started) => {
    await new CLI({
        startView: 'home'
    }).init();
}).catch(err => {
    debugger;
});

