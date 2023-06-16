const GitHubConnection = require('@services/GitHubAPI/GitHubConnection');
const JIRA = require('@services/JIRA');

async function preSave(next) {
    try {
        const signedUp = await this.signUp();

        if (this.raw.gitHubUser) {
            const gitHubUserInstance = new GitHubConnection({userName: this.raw.gitHubUser});
            const gitHubUserData = await gitHubUserInstance.getUser();

            this.gitHub = gitHubUserData;
        }

        if (this.raw.jiraUser) {
            const jiraService = new JIRA({ userName: this.raw.jiraUser, jiraToken: this.raw.jiraToken });
            const mySelf = await jiraService.mySelf();

            if (mySelf instanceof Error.Log) {
                throw mySelf;
            }

            if (mySelf.success) {
                this.jira = mySelf.data;
            }
        }
        
        if (signedUp instanceof Error.Log || !signedUp){
            throw signedUp;
        }

        if (!this.userName) {
            this.userName = this.email;
        }

        if (this.slackName) {
            this.slackName = '@' + this.slackName;
        }

        this.auth = signedUp._id;
        next();
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    preSave
};
