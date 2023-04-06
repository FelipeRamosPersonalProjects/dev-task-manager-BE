const config = require('../../../config.json');
const GitHubUser = require('./GitHubUser');

class GitHubConnection extends GitHubUser {
    constructor (setup = {
        userName: '',
        GITHUB_USER_TOKEN: '',
        organization: ''
    }) {
        super(setup);
        const { GITHUB_USER_TOKEN, userName, organization } = setup || {};

        this.getGITHUB_USER_TOKEN = () => GITHUB_USER_TOKEN || process.env.GITHUB_USER_TOKEN;
        this.userName = process.env.GITHUB_USER;
        this.organization = organization || userName;

        this.apiHostURL = config.github.apiHostURL;
    }

    buildURL(path) {
        return this.apiHostURL + path;
    }
}

module.exports = GitHubConnection;
