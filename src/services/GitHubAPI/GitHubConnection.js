const config = require('../../../config.json');

class GitHubConnection {
    constructor (setup = {
        userName: '',
        GITHUB_USER_TOKEN: ''
    }) {
        const { GITHUB_USER_TOKEN, userName } = setup || {};

        this.getGITHUB_USER_TOKEN = () => GITHUB_USER_TOKEN;
        this.userName = userName;

        this.apiHostURL = config.github.apiHostURL;
    }

    buildURL(path) {
        return this.apiHostURL + path;
    }
}

module.exports = GitHubConnection;
