const JIRAFields = require('@models/jira/Fields');

class JIRAIssue {
    static JIRAFields = JIRAFields;

    constructor(setup) {
        try {
            const { parentKey, issueKey, issueType, projectKey, title, description, infoDisplay } = Object(setup);

            this.key = new JIRAFields(issueKey).text();
            this.fields = {
                parent: new JIRAFields(parentKey).parent(),
                project: new JIRAFields(projectKey).project(),
                issuetype: new JIRAFields(issueType).issuetype(),
                summary: new JIRAFields(title).text(),
                description: new JIRAFields(description).paragraph(),
                customfield_10093: new JIRAIssue.JIRAFields(infoDisplay).text() // displayInfo
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    toCreate() {
        const create = {...this.fields};

        Object.keys(create).filter(key => {
            if (!create[key]) {
                delete create[key];
            }
        });

        return {
            fields: create
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
