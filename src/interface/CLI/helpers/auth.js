const FS = require('@services/FS');
const config = require('@config');

async function isAuthenticated(token) {
    try {
        const isSessionExist = FS.isExist(`${config.projectLocalPath}/${config.sessionPath}`);
        if (!isSessionExist) {
            return false;
        }

        const session = require('@SESSION_CLI');
        const sessionObj = Object.entries(session).find(([key, value]) => session[key] && value.token === token);

        if (!sessionObj) {
            return false;
        }

        if (sessionObj[1].expiration < Date.now()) {
            return false;
        }

        return true;
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    isAuthenticated 
};
