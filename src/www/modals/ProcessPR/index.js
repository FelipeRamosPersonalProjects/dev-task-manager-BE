const Component = require('@interface/Component');
const Spinner = require('@www/components/Spinner');
const BranchSwitcher = require('@www/components/BranchSwitcher');
const StepBegin = require('./StepBegin');
const { InputEdit, TextAreaEdit, SingleRelation } = require('@www/components/DocForm/FormField/fields');
const CRUD = require('@CRUD');

class ProcessPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ProcessPR.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, branchSwitcher, stepBegin, tickets, tasks, prDoc, promptContent } = Object(settings);
        
        if (isLoading) {
            this.isLoading = new Spinner();
        } else {
            this.promptContent = promptContent;
            this.tickets = tickets;
            this.tasks = tasks;
            this.setters.stepBegin(stepBegin);
            this.setters.branchSwitcher(branchSwitcher);
            this.setters.prDoc(prDoc);
        }
    }

    get setters() {
        return {
            branchSwitcher: (value) => {
                if (value) {
                    this.branchSwitcher = new BranchSwitcher(value);
                }
            },
            stepBegin: (value) => {
                if (value) {
                    this.stepBegin = new StepBegin(value);
                }
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

    get setProps() {
        return {
            branchSwitcherGroup: (value) => {
                try {
                    this.setters.branchSwitcher(value)
                    this.stepBegin.setters.branchSwitcher(value);
                } catch (error) {
                    throw new Error.Log(err);
                }
            }
        }
    }

    get setError() {
        return {
            BAD_BRANCH_NAME: () => {
                try {
                    this.branchSwitcher.setError.BAD_BRANCH_NAME();
                    this.stepBegin.setError.BAD_BRANCH_NAME();
                } catch (err) {
                    throw new Error.Log(err);
                }
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
