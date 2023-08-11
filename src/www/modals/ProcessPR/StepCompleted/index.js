const StringBuild = require('@STRING');
const StepModel = require('../StepModel');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');

class StepCompleted extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepCompleted.html');
    }

    constructor(settings, parent) {
        super(settings, parent);

        const { prDoc } = Object(settings);
        const { reviewers, gitHubPR, externalTicketURL, externalTaskURL, title } = Object(prDoc);
        const { html_url } = Object(gitHubPR);

        this.isLoading = new Spinner();
        this.setButton.copySlackFeedback(true);

        this.title = title;
        this.remoteURL = html_url;

        const slackFeedback = new StringBuild();
        slackFeedback.text('🎟️ Links').newLine();
        slackFeedback.text(`Pull Request: ${this.remoteURL}`).newLine();
        slackFeedback.text(`Ticket: ${externalTicketURL}`).newLine();
        slackFeedback.text(`Jira Task: ${externalTaskURL}`).newLine();
        slackFeedback.newLine();
        slackFeedback.text('Could you please take a look when you time?').newLine();
        slackFeedback.text('cc: ');

        this.slackFeedback = slackFeedback.end();
    }

    get setButton() {
        return {
            copySlackFeedback: (state) => {
                if (state) {
                    this.copySlackFeedbackButton = new Button({
                        label: 'Copy Slack Feedback',
                        attributes: 'js="step-concluded:copyslack"'
                    });
                } else {
                    delete this.copySlackFeedbackButton;
                }
            }
        };
    }
}

module.exports = StepCompleted;
