const config = require('../../../config.json');

class GitHubConnection {
    constructor (setup) {
        const { GITHUB_USER_TOKEN, userName } = setup || {};

        this.getGITHUB_USER_TOKEN = () => GITHUB_USER_TOKEN;
        this.userName = userName;

        this.apiHostURL = config.github.apiHostURL;
    }
}

module.exports = GitHubConnection;
