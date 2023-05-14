const config = require('../../../config.json');
const GitHubUser = require('./GitHubUser');
const AuthService = require('@services/Auth');

class GitHubConnection extends GitHubUser {
    constructor (setup = {
        userName: '',
        organization: ''
    }) {
        super(setup);
        const User = require('@models/collections/User');
        const { userName, organization } = Object(setup);

        this.getGITHUB_USER_TOKEN = () => {
            const authService = new AuthService();
            const raw = User.userSession();
            const parsed = authService.validateToken(raw.gitHubToken);

            return parsed;
        };

        this.userName = userName;
        this.organization = organization || userName;
        this.repoHostURL = config.github.apiHostURL;
    }

    get GITHUB_USER_TOKEN() {
        return this.getGITHUB_USER_TOKEN();
    }

    buildURL(path) {
        return this.repoHostURL + path;
    }

    async ajax(path, data, method) {
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
            const response = await ajax(url, data)[method]({
                headers: {
                    'Authorization': `Token ${this.GITHUB_USER_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });
            
            return response;
        } catch(err) {
            return new Error.Log(err).append('services.GitHubAPI.GitHubConnection.ajax', url);
        }
    }
}

module.exports = GitHubConnection;
