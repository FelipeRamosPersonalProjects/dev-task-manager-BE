const JIRAIssue = require('./Issue');

class JIRATicketIssue extends JIRAIssue {
    constructor(setup) {
        super(setup);

        try {
            const { priorityIndex, externalKey, externalURL, infoDisplay, mdHTML } = Object(setup);

            this.fields.customfield_10094 = new JIRAIssue.JIRAFields(priorityIndex || 0).number();
            this.fields.customfield_10096 = new JIRAIssue.JIRAFields(externalKey).text();
            this.fields.customfield_10095 = new JIRAIssue.JIRAFields(externalURL).text();
            this.fields.customfield_10093 = new JIRAIssue.JIRAFields(infoDisplay).text();
            this.fields.customfield_10091 = new JIRAIssue.JIRAFields(mdHTML).text();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRATicketIssue;
