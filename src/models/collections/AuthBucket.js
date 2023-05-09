const _Global = require('@models/maps/_Global');
const AuthService = require('@src/services/Auth');
const CRUD = require('@CRUD');

class AuthBucket extends _Global {
    constructor(setup, parent) {
        super(setup, parent);
        const { rule, password, gitHubToken, jiraToken, openAIToken, user } = Object(setup);
        const self = this;

        this.service = new AuthService({ parent: self });

        this.rule = rule;
        this.password = password;
        this.gitHubToken = gitHubToken;
        this.jiraToken = jiraToken;
        this.openAIToken = openAIToken;
        this.user = user ? user.oid(true) : {};
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
                password: user.raw.password,
                user: user.id
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
