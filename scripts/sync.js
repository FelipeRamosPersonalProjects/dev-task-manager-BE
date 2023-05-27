require('module-alias/register');
require('@global');

// Initializing MongoDB
require('@services/database/init').then(async () => {
    const Sync = require('@services/Sync');

    try {
        const sync = new Sync();
        const synced = await sync.fullSync();

        if (synced instanceof Error.Log) {
            throw synced;
        }

        synced.data.pullRequestSync.map(pr => {
            toolsCLI.print(pr.displayName, 'SYNC');
        });

        if (!synced.data.pullRequestSync.length) {
            toolsCLI.print('\nYour opened pull requests are up to date!\n\n', 'SYNC');
        }

        process.exit();
    } catch (err) {
        throw new Error.Log(err);
    }
}).catch(err => {
    throw new Error.Log(err);
});
