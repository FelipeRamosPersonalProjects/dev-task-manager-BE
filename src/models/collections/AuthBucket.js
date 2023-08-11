const _Global = require('@models/maps/_Global');
const AuthService = require('@services/Auth');
const CRUD = require('@CRUD');

class AuthBucket extends _Global {
    constructor(setup, parent) {
        super(setup, parent);
        const { rule, password, gitHubToken, jiraToken, openAIToken, user } = Object(setup);
        const self = this;

        this.service = new AuthService({ parent: self });

        this.rule = rule;
        this.password = password;
        this._gitHubToken = gitHubToken;
        this.jiraToken = jiraToken;
        this.openAIToken = openAIToken;
        this.user = user ? user.oid(true) : {};
    }

    get gitHubToken() {
        if (this._gitHubToken) {
            return this.service.validateToken(this._gitHubToken.toString());
        }
    }

    get userName() {
        return this.parent.getSafe('userName');
    }
    
    get userUID() {
        return this.user;
    }

    static async draft(user) {
        try {
            const auth = await CRUD.create('auth_buckets', {
                user: user.id,
                rule: user.raw.rule,
                password: user.raw.password,
                gitHubToken: user.raw.gitHubToken,
                jiraToken: user.raw.jiraToken
            });

            if (auth instanceof Error.Log || !auth) {
                throw auth;
            }

            return auth;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = AuthBucket;
