const JIRAConnect = require('./JIRAConnect');

class JIRA extends JIRAConnect {
    constructor (setup) {
        super(setup);

        try {
            const {  } = Object(setup);


        } catch (err) {
            throw new Error(err);
        }
    }

    async mySelf() {
        try {
            const created = await this.request('/myself');

            if (!created || created instanceof Error.Log) {
                throw created;
            }

            if (created.success) {
                return created.data.toSuccess();
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRA;
