const JIRAIssue = require('./Issue');

class JIRAInvestigationIssue extends JIRAIssue {
    constructor(setup) {
        super(setup);

        try {
            const { priorityIndex, externalKey, externalURL, infoDisplay, discovery } = Object(setup);
            const rootCauses = !discovery ? Object(setup)['discovery.rootCauses'] : discovery.rootCauses;
            const solutionSummary = !discovery ? Object(setup)['discovery.solutionSummary'] : discovery.solutionSummary;
            const findings = !discovery ? Object(setup)['discovery.findings'] : discovery.findings;

            this.fields.customfield_10094 = new JIRAIssue.JIRAFields(priorityIndex || 0).number();
            this.fields.customfield_10096 = new JIRAIssue.JIRAFields(externalKey).text();
            this.fields.customfield_10095 = new JIRAIssue.JIRAFields(externalURL).text();
            this.fields.customfield_10093 = new JIRAIssue.JIRAFields(infoDisplay).text();
            this.fields.customfield_10097 = new JIRAIssue.JIRAFields(rootCauses).paragraph();
            this.fields.customfield_10098 = new JIRAIssue.JIRAFields(solutionSummary).paragraph();

            this.fields.comments = new JIRAIssue.JIRAFields(Array.isArray(findings) && findings.length ? findings : null).comments();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRAInvestigationIssue;
