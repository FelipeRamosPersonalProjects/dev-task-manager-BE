const Config = require('@config');
const CRUD = require('@CRUD');

class JIRAConnect {
    constructor(setup) {
        try {
            const { jiraToken, userName, userUID } = Object(setup);

            if ((!jiraToken && !userName) && !userUID) {
                throw new Error.Log({
                    name: 'JIRA_USER_CREDENTIALS_REQUIRED',
                    message: `Any "userUID", "jiraToken" or "userName" was provided to JIRA Service! It's required to provide "userUID" or ("jiraToken" and "userName").`
                });
            }

            this._jiraToken = () => jiraToken;
            this.userName = userName;
            this.userUID = userUID;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get apiRoot() {
        return Config.jira.apiRootURL;
    }

    get jiraToken() {
        return this._jiraToken();
    }

    async request(relativePath, data, options) {
        const { method } = Object(options);
        
        try {
            if (this.userUID && (!this.userName || !this.jiraToken)) {
                const userQuery = await CRUD.getDoc({ collectionName: 'users', filter: this.userUID }).defaultPopulate();
                if (!userQuery || userQuery instanceof Error.Log) {
                    throw new Error.Log(userQuery);
                }

                this.user = userQuery.initialize();
                this.userName = this.user.jiraUser;
                this._jiraToken = () => this.user.auth.jiraToken;
            }

            const response = await ajax(this.apiRoot + relativePath, data)[method || 'get']({
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${this.userName}:${this.jiraToken}`).toString('base64')}`,
                    'Accept': 'application/json'
                }
            });

            if (response instanceof Error.Log) {
                throw response;
            }

            return response.toSuccess();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRAConnect;
