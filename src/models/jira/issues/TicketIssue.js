const JIRAIssue = require('./Issue');

class JIRATicketIssue extends JIRAIssue {
    constructor(setup) {
        super(setup);

        try {
            const { externalKey } = Object(setup);

            this.fields.customfield_10085 = new JIRAIssue.JIRAFields(externalKey).text();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRATicketIssue;
