const JIRAIssue = require('./Issue');

class JIRAValidationIssue extends JIRAIssue {
    constructor(setup) {
        super(setup);

        try {
            const { priorityIndex, externalKey, externalURL, instance, reportSummary, conclusion } = Object(setup);

            this.fields.customfield_10094 = new JIRAIssue.JIRAFields(priorityIndex || 0).number();
            this.fields.customfield_10096 = new JIRAIssue.JIRAFields(externalKey).text();
            this.fields.customfield_10095 = new JIRAIssue.JIRAFields(externalURL).text();

            // Validation custom fields
            this.fields.customfield_10121 = new JIRAIssue.JIRAFields(instance).select();
            this.fields.customfield_10122 = new JIRAIssue.JIRAFields(reportSummary).paragraph();
            this.fields.customfield_10123 = new JIRAIssue.JIRAFields(conclusion).paragraph();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRAValidationIssue;
