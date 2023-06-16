const JIRAConnect = require('./JIRAConnect');
const JIRATicket = require('@models/jira/issues/TicketIssue')

class JIRA extends JIRAConnect {
    constructor (setup) {
        super(setup);

        try {
            const {  } = Object(setup);


        } catch (err) {
            throw new Error.Log(err);
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

    async createIssue(data) {
        const { issueType, externalKey, projectKey, title, description } = Object(data);
        
        try {
            const created = await this.request(`/issue`, new JIRATicket({
                issueType,
                externalKey,
                projectKey,
                summary: title,
                description
            }).toObject(), { method: 'post' });

            return created;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRA;
