const Config = require('@config');

class JIRAConnect {
    constructor(setup) {
        try {
            const { jiraToken, user } = Object(setup);

            this._jiraToken = () => jiraToken;
            this.user = user;
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
            const response = await ajax(this.apiRoot + relativePath, Object(data))[method || 'get']({
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${this.user.userName}:${process.env.JIRA_TOKEN}`).toString('base64')}`,
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
