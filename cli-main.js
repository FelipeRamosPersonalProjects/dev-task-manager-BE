const CLI = require('./src/interface/CLI');

// Declaring globals
require('./src/global');
// Initializing MongoDB
require('./src/services/database/init').then(async (started) => {
    const cli = await new CLI({
        startView: 'home'
    }).init();

    console.log(cli)
}).catch(err => {
    debugger;
});

