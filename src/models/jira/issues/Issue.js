const JIRAFields = require('@models/jira/Fields');

class JIRAIssue {
    static JIRAFields = JIRAFields;

    constructor(setup) {
        try {
            const { issueKey, issueType, projectKey, title, description } = Object(setup);

            this.key = new JIRAFields(issueKey).text();
            this.fields = {
                project: new JIRAFields(projectKey).project(),
                issuetype: new JIRAFields(issueType).issuetype(),
                summary: new JIRAFields(title).text(),
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
        const update = {...this.fields};

        Object.keys(update).filter(key => {
            if (!update[key]) {
                delete update[key];
            }
        });

        return { fields: update };
    }
}

module.exports = JIRAIssue;
