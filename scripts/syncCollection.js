require('module-alias/register');
// Declaring globals
require('@global');

// Initializing MongoDB
require('@services/database/init').then(async () => {        
    
}).catch(err => {
    new Error.Log(err).consolePrint();
});
