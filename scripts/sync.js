require('module-alias/register');
require('@global');

const auth = require('@CLI/helpers/auth');
const Sync = require('@services/Sync');
const FS = require('@services/FS');
const Config = require('@config');
const CLI = require('@interface/CLI');

// Initializing MongoDB
require('@services/database/init').then(async (response) => {
    const isSessionExist = FS.isExist(Config.sessionPath);
    const session = Object(isSessionExist && require('@SESSION_CLI'));
    const currentUser = session.currentUser;
    const token = currentUser && session[currentUser] && session[currentUser].token;

    if (await auth.isAuthenticated(token)) {
        const sync = new Sync();
        const synced = await sync.fullSync();
        debugger;
    } else {
        await new CLI({
            startView: 'user/authView',
            startViewParams: { token }
        }).init();
    }
});
