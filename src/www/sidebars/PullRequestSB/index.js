const Component = require('@interface/Component');
const BranchSwitcher = require('@www/components/BranchSwitcher');
const SingleRelation = require('@www/components/DocForm/FormField/SingleRelation');
const MultiRelation = require('@www/components/DocForm/FormField/MultiRelation');
const TicketTile = require('@www/tiles/TicketTile');
const TaskTile = require('@www/tiles/TaskTile');

class PullRequestSB extends Component {
    get SOURCE_PATH() {
        return require.resolve('./PullRequestSB.html');
    }

    constructor(settings, parent) {
        super(settings);

        const { pullRequest, repoManager, sessionUser, tickets, tasks, users, labels, reviewers } = Object(settings);
        
        // repoManager.connectAPI(sessionUser);

        this.parent = parent;
        this.collection = 'pull_requests';
        // this.branchSwitcher = new BranchSwitcher({ currentBranch: repoManager.getCurrentBranch() });

        this.pullRequest = pullRequest;
        this.tickets = tickets;
        this.tasks = tasks;
        this.users = users;
        this.labels = labels;
        this.reviewers = reviewers;
       
        this.setters.ticket();
        this.setters.task();
        this.setters.assignedUsers();
        this.setters.labels();
        this.setters.reviewers();
    }

    get setters() {
        return {
            ticket: () => {
                const { ticket } = Object(this.pullRequest);

                if (ticket) {
                    this.ticket = new TicketTile(ticket);
                }
            },
            task: () => {
                const { task } = Object(this.pullRequest);

                if (task) {
                    this.task = new TaskTile(task);
                }
            },
            assignedUsers: () => {
                this.assignedUsers = new MultiRelation({
                    view: 'read',
                    fieldName: 'assignedUsers',
                    label: 'Assigned Users:',
                    options: this.parent.users,
                    currentValue: this.pullRequest.assignedUsers
                })
            },
            labels: () => {
                this.labels = new MultiRelation({
                    view: 'read',
                    fieldName: 'labels',
                    label: 'Labels:',
                    options: this.parent.labels,
                    currentValue: this.pullRequest.labels
                })
            },
            reviewers: () => {
                this.reviewers = new MultiRelation({
                    view: 'read',
                    fieldName: 'reviewers',
                    label: 'Reviewers:',
                    options: this.parent.reviewers,
                    currentValue: this.pullRequest.reviewers
                })
            }
        }
    }
}

module.exports = PullRequestSB;

