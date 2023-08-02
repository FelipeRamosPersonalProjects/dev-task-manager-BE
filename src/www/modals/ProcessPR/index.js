const Component = require('@interface/Component');
const Spinner = require('@www/components/Spinner');
const BranchSwitcher = require('@www/components/BranchSwitcher');
const StepBegin = require('./StepBegin');
const StepPrepare = require('./StepPrepare');
const StepCommit = require('./StepCommit');
const Paragraph = require('@src/www/components/Paragraph');
const { InputEdit, TextAreaEdit, SingleRelation } = require('@www/components/DocForm/FormField/fields');

class ProcessPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ProcessPR.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, branchSwitcher, stepBegin, tickets, tasks, prDoc } = Object(settings);
        
        if (isLoading) {
            this.isLoading = new Spinner();
        } else {
            this.tickets = tickets;
            this.tasks = tasks;
            this.setters.stepBegin(stepBegin);
            this.setters.branchSwitcher(branchSwitcher);
            this.setters.prDoc(prDoc);
        }

        this.types = {
            Paragraph
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
            stepPrepare: (value) => {
                if (value) {
                    this.stepPrepare = new StepPrepare(value);
                }
            },
            stepCommit: (value) => {
                if (value) {
                    this.stepCommit = new StepCommit(value);
                }
            },
            prDoc: (value) => {
                this.prDoc = value || this.prDoc;
                const { title, summary, base, head, project, ticket, task, logsHistory } = Object(this.prDoc);
                
                this.title = title;
                this.logsHistory = Array.isArray(logsHistory) ? logsHistory.map(text => ({ text })) : [];
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

    get nextStep() {
        return {
            prepare: () => {
                this.stepBegin.resolve();
                this.setters.stepPrepare({ currentBranch: this.branchSwitcher.currentBranch, headBranch: this.prDoc.head });
                this.stepPrepare.setButton.createRecommended(true);
                this.stepPrepare.setCurrent(true);
            },
            commit: () => {
                this.stepPrepare.resolve();
                this.setters.stepCommit({prDoc: this.prDoc});
                this.stepCommit.setCurrent(true);
            }
        };
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
            },
            DUPLICATED_BRANCH: (customBranchName) => {
                try {
                    this.stepPrepare.setError.DUPLICATED_BRANCH(customBranchName || this.prDoc.head);
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
