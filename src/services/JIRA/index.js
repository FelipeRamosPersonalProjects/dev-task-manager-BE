const JIRAConnect = require('./JIRAConnect');

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
        const { issueType, ticketID, projectKey, title, description } = Object(data);

        try {
            const created = await this.request(`/issue`, {
                fields: {
                    project: { key: projectKey },
                    issuetype: { id: issueType },
                    summary: title,
                    customfield_10085: ticketID,
                    description: {
                        content: [
                            {
                                content: [
                                    {
                                        text: description,
                                        type: 'text'
                                    }
                                ],
                                type: 'paragraph'
                            }
                        ],
                        type: 'doc',
                        version: 1
                    }
                }
            }, { method: 'post' });

            return created;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRA;
