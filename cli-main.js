// Declaring globals
require('./src/global');
// Initializing MongoDB
require('./src/services/database/init').then(async (started) => {
    console.log('dir:', __dirname);
    try {
        const CLI = require('./src/interface/CLI');
        const cli = await new CLI({
            startView: 'home'
        }).init();
    } catch(err) {
        console.error(err.stack);
    }
}).catch(err => {
    throw new Error.Log(err);
});

