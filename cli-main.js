// Declaring globals
require('./src/global');
// Initializing MongoDB
require('./src/services/database/init').then(async (started) => {
    try {
        const CLI = require('./src/interface/CLI');
        await new CLI({
            startView: 'home',
            startViewParams: {
                collectionName: 'tasks',
                filter: '64289add3818fa7d00371f06'
            }
        }).init();
    } catch(err) {
        console.error(err.stack);
    }
}).catch(err => {
    throw new Error.Log(err);
});

