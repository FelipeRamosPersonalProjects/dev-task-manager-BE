require('module-alias/register');
// Declaring globals
require('@global');
// Initializing MongoDB
require('@services/database/init').then(async (started) => {
    try {
        const CLI = require('@interface/CLI');
        await new CLI({
            startView: 'user/signUp'
        }).init();
    } catch(err) {
        console.error(err.stack);
    }
}).catch(err => {
    throw new Error.Log(err);
});

