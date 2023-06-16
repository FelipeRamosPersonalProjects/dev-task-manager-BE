const JIRAFields = require('@models/jira/Fields');

class JIRAIssue {
    static JIRAFields = JIRAFields;

    constructor(setup) {
        try {
            const { issueType, projectKey, key, summary, description } = Object(setup);

            this.key = new JIRAFields(key).text();

            this.fields = {
                project: new JIRAFields(projectKey).project(),
                issuetype: new JIRAFields(issueType).issuetype(),
                summary: new JIRAFields(summary).text(),
                description: new JIRAFields(description).paragraph()
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    toCreate() {
        return {
            fields: this.fields
        }
    }
}

module.exports = JIRAIssue;
