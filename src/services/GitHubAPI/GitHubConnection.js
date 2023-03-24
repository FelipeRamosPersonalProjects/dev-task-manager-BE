const config = require('../../../config.json');

class GitHubConnection {
    constructor (setup = {
        userName: '',
        GITHUB_USER_TOKEN: '',
        organization: ''
    }) {
        const { GITHUB_USER_TOKEN, userName, organization } = setup || {};

        this.getGITHUB_USER_TOKEN = () => GITHUB_USER_TOKEN || process.env.GITHUB_USER_TOKEN;
        this.userName = userName || organization;
        this.organization = organization || userName;

        this.apiHostURL = config.github.apiHostURL;
    }

    buildURL(path) {
        return this.apiHostURL + path;
    }
}

module.exports = GitHubConnection;
