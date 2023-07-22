const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/pullrequests.workflow');
const DocForm = require('@www/components/DocForm');
const { StatusInput, InputEdit, SingleRelation, MultiRelation, TextAreaEdit } = require('@www/components/DocForm/FormField/fields');

class PullRequestEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditPullRequest.html');
    }

    constructor(settings) {
        super(settings);

        const { collection, pullRequestDoc, tickets, tasks, users, labels, reviewers } = Object(settings);
        const { _id, status, displayName, ticket, task, summary, title, base, head, version } = Object(pullRequestDoc);

        this.UID = _id;
        this.collection = collection;
        this.displayName = displayName;
        this.settings = settings;

        if (pullRequestDoc) {
            this.docForm = new DocForm({
                collection: 'pull_requests',
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
                    new SingleRelation({
                        view: 'read',
                        fieldName: 'ticket',
                        label: 'Ticket:',
                        options: tickets,
                        currentValue: Object(ticket).displayName
                    }),
                    new SingleRelation({
                        view: 'read',
                        fieldName: 'task',
                        label: 'Task:',
                        options: tasks,
                        currentValue: Object(task).displayName
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
                    new MultiRelation({
                        view: 'read',
                        fieldName: 'assignedUsers',
                        label: 'Assigned Users:',
                        options: users,
                        currentValue: pullRequestDoc.assignedUsers
                    }),
                    new MultiRelation({
                        view: 'read',
                        fieldName: 'labels',
                        label: 'Labels:',
                        options: labels,
                        currentValue: pullRequestDoc.labels
                    }),
                    new MultiRelation({
                        view: 'read',
                        fieldName: 'reviewers',
                        label: 'Reviewers:',
                        options: reviewers,
                        currentValue: pullRequestDoc.reviewers
                    })
                ]
            });
        }
    }
}

module.exports = PullRequestEdit;
