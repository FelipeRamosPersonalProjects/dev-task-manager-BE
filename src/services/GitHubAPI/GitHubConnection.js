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

        this.repoHostURL = config.github.apiHostURL;
    }

    buildURL(path) {
        return this.repoHostURL + path;
    }

    async ajax(path, method) {
        const url = this.buildURL(path);

        if (!method) {
            method = 'get';
        } else if (typeof method === 'string') {
            method = method.toLowerCase();
        }
        
        if (!ajax()[method]) {
            throw new Error.Log({
                name: 'GitHubConnectionAjaxBadMethod',
                message: `The http request method provided to GitHubConnection.ajax, is not valid! Received: ${method}.`
            });
        }

        try {
            const response = await ajax(url)[method]({
                headers: {
                    'Authorization': `Token ${this.getGITHUB_USER_TOKEN()}`,
                    "Content-Type": "application/json"
                }
            });
            
            return response;
        } catch(err) {
            return new Error.Log(err).append({
                name: 'GitHubConnectionAjax',
                message: `An error occured during the GitHubConnection.ajax call for the URL: ${url}`
            });
        }
    }
}

module.exports = GitHubConnection;
