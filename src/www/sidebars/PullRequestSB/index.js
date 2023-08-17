const Component = require('@interface/Component');
const BranchSwitcher = require('@www/components/BranchSwitcher');
const MultiRelation = require('@www/components/DocForm/FormField/MultiRelation');
const RepoTile = require('@www/tiles/RepoTile');
const ProjectTile = require('@src/www/tiles/ProjectTile');
const workflow = require('@CONFIGS/workflows/pullrequests.workflow');
const StatusInput = require('@src/www/components/DocForm/FormField/StatusInput');

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
        this.status = new StatusInput({
            label: 'Status:',
            fieldName: 'status',
            view: 'read',
            currentValue: Object(workflow.getStatus(Object(this.pullRequest).status)),
            options: workflow.statuses.map(item => ({
                collection: this.collection,
                docUID: this.pullRequest && this.pullRequest._id,
                displayName: item.displayName.toUpperCase(),
                statusID: item.statusID,
                transitionID: item.jiraID
            }))
        }),
       
        this.setters.repo();
        this.setters.project();
        this.setters.assignedUsers();
        this.setters.labels();
        this.setters.reviewers();
    }

    get setters() {
        return {
            repo: () => {
                const { task } = Object(this.pullRequest);
                const { repo } = Object(task);

                if (repo) {
                    this.repo = new RepoTile(repo);
                }
            },
            project: () => {
                const { task } = Object(this.pullRequest);
                const { project } = Object(task);

                if (project) {
                    this.project = new ProjectTile(project);
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

