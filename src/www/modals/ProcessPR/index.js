const Component = require('@interface/Component');
const BranchSwitcher = require('@www/components/BranchSwitcher');
const { InputEdit, SelectInputEdit, TextAreaEdit, SingleRelation, StatusInput } = require('@www/components/DocForm/FormField/fields');

class ProcessPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ProcessPR.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, branchSwitcher, tickets, tasks, prDoc, promptContent } = Object(settings);
        
        if (isLoading) {
            this.isLoading = 'Loading...';
        } else {
            this.promptContent = promptContent;
            this.tickets = tickets;
            this.tasks = tasks;
            this.setters.branchSwitcher(branchSwitcher);
            this.setters.prDoc(prDoc);
        }
    }

    get setters() {
        return {
            branchSwitcher: (branchSwitcher) => {
                this.branchSwitcher = new BranchSwitcher(branchSwitcher);
            },
            prDoc: (value) => {
                this.prDoc = value || this.prDoc;
                const { title, summary, base, head, project, ticket, task } = Object(this.prDoc);
                
                this.title = title;
                this.summary = new TextAreaEdit({
                    view: 'read',
                    fieldName: 'summary',
                    label: 'Summary:',
                    currentValue: summary
                });
                this.base = new InputEdit({
                    view: 'read',
                    fieldName: 'base',
                    label: 'Base Branch:',
                    currentValue: base
                });
                this.head = new InputEdit({
                    view: 'read',
                    fieldName: 'head',
                    label: 'Head Branch:',
                    currentValue: head
                });
                this.project = new SingleRelation({
                    view: 'read',
                    fieldName: 'project',
                    label: '📽️ Project:',
                    currentValue: project,
                    options: this.projects
                });
                this.ticket = new SingleRelation({
                    view: 'read',
                    fieldName: 'ticket',
                    label: '🎟️ Ticket:',
                    currentValue: ticket,
                    options: this.tickets
                });
                this.task = new SingleRelation({
                    view: 'read',
                    fieldName: 'task',
                    label: '📄 Task:',
                    currentValue: task,
                    options: this.tasks
                });
            }
        }
    }

    async load() {
        try {
            await this.loadDependencies();
            this.setters.prDoc();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ProcessPR;
