// Declaring globals
require('./src/global');
// Initializing MongoDB
require('./src/services/database/init').then(async (started) => {
    try {
        const CLI = require('./src/interface/CLI');
        await new CLI({
            startView: 'ticketRead'
        }).init();
    } catch(err) {
        console.error(err.stack);
    }
}).catch(err => {
    throw new Error.Log(err);
});

