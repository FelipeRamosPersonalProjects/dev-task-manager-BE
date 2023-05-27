const Config = require('@config');
const GitHubUser = require('./GitHubUser');
const AuthService = require('@services/Auth');

class GitHubConnection extends GitHubUser {
    constructor (setup) {
        super(setup);
        const { userName, organization } = Object(setup);

        this.userName = userName;
        this.organization = organization || userName;
        this.repoHostURL = Config.github.apiHostURL;
    }

    get GITHUB_USER_TOKEN() {
        return this.getGitHubToken();
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

    async ajax(path, data, options) {
        let {method, rawURL} = Object(options);
        const url = this.buildURL(path, rawURL);

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
