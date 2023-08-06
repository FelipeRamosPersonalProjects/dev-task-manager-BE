const Config = require('@config');
const GitHubUser = require('./GitHubUser');
const AuthService = require('@services/Auth');

class GitHubConnection extends GitHubUser {
    constructor (setup) {
        super(setup);
        const { userName, organization, gitHubToken } = Object(setup);

        this.userName = userName;
        this.organization = organization || userName;
        this.repoHostURL = Config.github.apiHostURL;
        this._gitHubToken = gitHubToken;
    }

    get GITHUB_USER_TOKEN() {
        if (this._gitHubToken) {
            return this._gitHubToken;
        }

        return;
    }

    get isConnected() {
        if (this.GITHUB_USER_TOKEN && this.userName) {
            return true;
        } else {
            return false;
        }
    }

    getGitHubToken() {
        const User = require('@models/collections/User');
        const authService = new AuthService();
        const raw = User.userSession();
        const parsed = authService.validateToken(raw.gitHubToken);

        return parsed;
    }

    buildURL(path, raw) {
        return !raw ? this.repoHostURL + path : path;
    }

    connectAPI(sessionUser) {
        if (sessionUser) {
            this._gitHubToken = sessionUser.gitHubToken;
            this.userName = sessionUser.gitHubUser;

            return this;
        }
    }

    async ajax(path, data, options) {
        let {method, rawURL, noToken} = Object(options);
        const url = this.buildURL(path, rawURL);

        if (!this.GITHUB_USER_TOKEN && !noToken) {
            throw new Error.Log({
                name: 'GITHUB_MISSING_TOKEN',
                message: `Your user token is required to perform this action!`
            });
        }

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
            const response = await ajax(url, Object(data))[method]({
                headers: {
                    'Authorization': noToken ? undefined :`Token ${this.GITHUB_USER_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response;
        } catch(err) {
            return new Error.Log(err).append('services.GitHubAPI.GitHubConnection.ajax', url);
        }
    }
}

module.exports = GitHubConnection;
