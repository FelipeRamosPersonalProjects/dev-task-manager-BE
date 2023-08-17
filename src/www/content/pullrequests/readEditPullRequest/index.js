const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/pullrequests.workflow');
const DocForm = require('@www/components/DocForm');
const TicketTile = require('@www/tiles/TicketTile');
const TaskTile = require('@www/tiles/TaskTile');
const { StatusInput, InputEdit, TextAreaEdit } = require('@www/components/DocForm/FormField/fields');

class PullRequestEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditPullRequest.html');
    }

    constructor(settings) {
        super(settings);

        const { pullRequestDoc, tickets, tasks, users, labels, reviewers } = Object(settings);

        this.collection = 'pull_requests';
        this.tickets = tickets;
        this.tasks = tasks;
        this.users = users;
        this.labels = labels;
        this.reviewers = reviewers;

        this.setters.pullRequestDoc(pullRequestDoc);
        this.setters.task();
        this.setters.ticket();
    }

    get setters() {
        return {
            ticket: () => {
                const { ticket } = Object(this.pullRequestDoc);

                if (ticket) {
                    this.ticket = new TicketTile(ticket);
                }
            },
            task: () => {
                const { task } = Object(this.pullRequestDoc);

                if (task) {
                    this.task = new TaskTile(task);
                }
            },
            pullRequestDoc: (pullRequestDoc) => {
                if (pullRequestDoc) {
                    this.pullRequestDoc = pullRequestDoc;
                }

                if (this.pullRequestDoc) {
                    const {
                        _id,
                        status,
                        displayName,
                        summary,
                        description,
                        title,
                        base,
                        head,
                        version
                    } = Object(pullRequestDoc || this.pullRequestDoc);

                    this.UID = _id;
                    this.displayName = displayName;
                    this.docForm = new DocForm({
                        collection: this.collection,
                        wrapperTag: 'div',
                        fields: [
                            new StatusInput({
                                label: 'Status:',
                                fieldName: 'status',
                                view: 'read',
                                currentValue: Object(workflow.getStatus(status)),
                                options: workflow.statuses.map(item => ({
                                    collection: this.collection,
                                    docUID: this.UID,
                                    displayName: item.displayName.toUpperCase(),
                                    statusID: item.statusID,
                                    transitionID: item.jiraID
                                }))
                            }),
                            new InputEdit({
                                view: 'read',
                                fieldName: 'base',
                                label: 'Base Branch:',
                                currentValue: base
                            }),
                            new InputEdit({
                                view: 'read',
                                fieldName: 'head',
                                label: 'Head Branch:',
                                currentValue: head
                            }),
                            new InputEdit({
                                view: 'read',
                                fieldName: 'title',
                                label: 'Title:',
                                currentValue: title
                            }),
                            new InputEdit({
                                view: 'read',
                                inputType: 'number',
                                fieldName: 'version',
                                label: 'PR Version:',
                                currentValue: version
                            }),
                            new TextAreaEdit({
                                view: 'read',
                                fieldName: 'summary',
                                label: 'Summary:',
                                currentValue: summary
                            }),
                            new TextAreaEdit({
                                view: 'read',
                                fieldName: 'description',
                                label: 'Description:',
                                inputType: 'textarea',
                                currentValue: description
                            })
                        ]
                    });
                }
            }
        };
    }

    async load() {
        try {
            await this.loadDependencies();
            this.setters.pullRequestDoc();
            this.setters.ticket();
            this.setters.task();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = PullRequestEdit;
