const JIRAIssue = require('./Issue');

class JIRAEstimationIssue extends JIRAIssue {
    constructor(setup) {
        super(setup);

        try {
            const { priorityIndex, type, unit, infoDisplay, FE, BE, QA, others, totalEstimation, fullEstimation } = Object(setup);

            this.fields.customfield_10094 = new JIRAIssue.JIRAFields(priorityIndex).number();
            this.fields.customfield_10093 = new JIRAIssue.JIRAFields(infoDisplay).text();
            this.fields.customfield_10105 = new JIRAIssue.JIRAFields(type).select();
            this.fields.customfield_10106 = new JIRAIssue.JIRAFields(unit).select();
            this.fields.customfield_10100 = new JIRAIssue.JIRAFields(FE).number();
            this.fields.customfield_10101 = new JIRAIssue.JIRAFields(BE).number();
            this.fields.customfield_10102 = new JIRAIssue.JIRAFields(QA).number();
            this.fields.customfield_10103 = new JIRAIssue.JIRAFields(others).number();
            this.fields.customfield_10118 = new JIRAIssue.JIRAFields(totalEstimation).number();
            this.fields.customfield_10117 = new JIRAIssue.JIRAFields(fullEstimation).text();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRAEstimationIssue;
