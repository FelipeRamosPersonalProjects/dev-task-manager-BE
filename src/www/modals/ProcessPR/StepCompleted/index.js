const StringBuild = require('@STRING');
const Component = require('@interface/Component');
const Button = require('@www/components/DocForm/FormField/Button');
const Spinner = require('@www/components/Spinner');

class StepCompleted extends Component {
    get SOURCE_PATH() {
        return require.resolve('./StepCompleted.html');
    }

    constructor(settings) {
        super(settings);

        const { prDoc } = Object(settings);
        const { reviewers, gitHubPR, externalTicketURL, externalTaskURL, title } = Object(prDoc);
        const { html_url } = Object(gitHubPR);

        this.isLoading = new Spinner();
        this.setCurrent(true);
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

    setCurrent(state) {
        try {
            if (state) {
                this.isCurrentClass = 'current-step';
            } else {
                this.isCurrentClass = '';
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    removeError() {
        try {
            delete this.error;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get setError() {        
        this.error = 'error';

        return {};
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

    resolve() {
        try {
            this.resolved = true;
            this.setCurrent(false);
            this.removeError();

            // Hiding the buttons
            Object.keys(this.setButton).map(key => this.setButton[key](false));
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = StepCompleted;
