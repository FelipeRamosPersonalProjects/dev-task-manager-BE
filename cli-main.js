require('module-alias/register');
// Declaring globals
require('@global');

const FS = require('@services/FS');
const CLI = require('@interface/CLI');
const config = require('@config');

// Initializing MongoDB
require('@services/database/init').then(async () => {
    try {
        const isSessionExist = FS.isExist(config.sessionPath);
        const session = Object(isSessionExist && require('@SESSION_CLI'));
        const currentUser = session.currentUser;
        const token = currentUser && session[currentUser] && session[currentUser].token;

        await new CLI({
            startView: 'user/authView',
            startViewParams: { token, redirectTo: 'home' }
        }).init();
    } catch(err) {
        throw err.stack
    }
}).catch(err => {
    throw new Error.Log(err);
});

