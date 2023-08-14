const Component = require('@interface/Component');
const BranchSwitcher = require('@www/components/BranchSwitcher');
const SingleRelation = require('@www/components/DocForm/FormField/SingleRelation');
const MultiRelation = require('@www/components/DocForm/FormField/MultiRelation');

class PullRequestSB extends Component {
    get SOURCE_PATH() {
        return require.resolve('./PullRequestSB.html');
    }

    constructor(settings) {
        super(settings);

        const { pullRequestDoc, repoManager, sessionUser, tickets, tasks, users, labels, reviewers } = Object(settings);
        
        // repoManager.connectAPI(sessionUser);

        this.collection = 'pull_requests';
        // this.branchSwitcher = new BranchSwitcher({ currentBranch: repoManager.getCurrentBranch() });
        this.tickets = tickets;
        this.tasks = tasks;
        this.users = users;
        this.labels = labels;
        this.reviewers = reviewers;
    }

    get setters() {
        return {
        }
    }
    
    async load() {
        try {
            await this.loadDependencies();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = PullRequestSB;

