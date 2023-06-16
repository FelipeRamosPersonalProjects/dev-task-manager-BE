const JIRAFields = require('@models/jira/Fields');

class JIRAIssue {
    static JIRAFields = JIRAFields;

    constructor(setup) {
        try {
            const { issueKey, issueType, projectKey, summary, description } = Object(setup);

            this.key = new JIRAFields(issueKey).text();
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

    toUpdate() {
        const update = {...this};

        Object.keys(result).filter(key => {
            if (!result[key]) {
                delete result[key];
            }
        });

        return { update };
    }
}

module.exports = JIRAIssue;
