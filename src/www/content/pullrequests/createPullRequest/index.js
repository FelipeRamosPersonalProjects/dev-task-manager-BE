const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, TextArea, SingleRelation, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class PullRequestCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createPullRequest.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets, users, labels, reviewers, tasks } = Object(settings);

        this.docForm = new DocForm({
            collection: 'pull_requests',
            fields: [
                new SingleRelation({
                    fieldName: 'ticket',
                    label: 'Ticket:',
                    options: tickets
                }),
                new SingleRelation({
                    fieldName: 'task',
                    label: 'Task:',
                    options: tasks
                }),
                new Input({
                    fieldName: 'base',
                    label: 'Base Branch:',
                }),
                new Input({
                    fieldName: 'head',
                    label: 'Head Branch:',
                }),
                new Input({
                    fieldName: 'title',
                    label: 'Title:'
                }),
                new Input({
                    inputType: 'number',
                    fieldName: 'version',
                    label: 'PR Version:'
                }),
                new TextArea({
                    fieldName: 'summary',
                    label: 'Summary:'
                }),
                new MultiRelation({
                    fieldName: 'assignedUsers',
                    label: 'Assigned Users:',
                    options: users
                }),
                new MultiRelation({
                    fieldName: 'labels',
                    label: 'Labels:',
                    options: labels
                }),
                new MultiRelation({
                    fieldName: 'reviewers',
                    label: 'Reviewers:',
                    options: reviewers
                })
            ]
        });
    }
}

module.exports = PullRequestCreate;
