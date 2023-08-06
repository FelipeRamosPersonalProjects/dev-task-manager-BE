const Component = require('@interface/Component');
const Spinner = require('@www/components/Spinner');
const BranchSwitcher = require('@www/components/BranchSwitcher');
const StepBegin = require('./StepBegin');
const StepPrepare = require('./StepPrepare');
const StepCommit = require('./StepCommit');
const StepPublish = require('./StepPublish');
const StepChangesDescription = require('./StepChangesDescription');
const StepCreatePR = require('./StepCreatePR');
const Paragraph = require('@src/www/components/Paragraph');
const { InputEdit, TextAreaEdit, SingleRelation } = require('@www/components/DocForm/FormField/fields');
const CRUD = require('@CRUD');

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
            stepPublish: (value) => {
                if (value) {
                    this.stepPublish = new StepPublish(value);
                }
            },
            stepChangesDescription: (value) => {
                if (value) {
                    this.stepChangesDescription = new StepChangesDescription(value);
                }
            },
            stepCreatePR: (value) => {
                if (value) {
                    this.stepCreatePR = new StepCreatePR(value);
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
                if (!this.prDoc) return;

                this.stepBegin.resolve();
                this.setters.stepPrepare({ currentBranch: this.branchSwitcher.currentBranch, headBranch: this.prDoc.head });
                this.stepPrepare.setButton.createRecommended(true);
                this.stepPrepare.setButton.skip(true);
                this.stepPrepare.setCurrent(true);
            },
            commit: () => {
                this.stepPrepare.resolve();
                this.setters.stepCommit({prDoc: this.prDoc});
                this.stepCommit.setCurrent(true);
            },
            publish: async (userSession) => {
                const repoManager = this.prDoc && this.prDoc.repoManager;
                let isBranchExist;
                let currentBranch;
                
                this.stepCommit.resolve();
                if (repoManager) {
                    repoManager.connectAPI(userSession);
                    currentBranch = repoManager && await repoManager.getCurrentBranch();
                    isBranchExist = currentBranch && await repoManager.isBranchExist(currentBranch);
                }

                this.setters.stepPublish({ isBranchExist, currentBranch });
                this.stepPublish.setCurrent(true);
            },
            changesDescription: async () => {
                const repoManager = this.prDoc && this.prDoc.repoManager;
                const compare = repoManager && await repoManager.compareBranches(this.prDoc.base, this.prDoc.head);

                if (!compare || compare instanceof Error.Log) {
                    return compare
                }

                const updated = await this.prDoc.updateDB({ filter: { index: this.prDoc.index }, data: { fileChanges: compare.files }});
                if (updated instanceof Error.Log) {
                    return updated;
                }

                this.prDoc.fileChanges = compare.files;
                this.stepPublish.resolve();
                this.setters.stepChangesDescription(this.prDoc);
            },
            createPR: async () => {
                const project = this.prDoc && this.prDoc.project;
                const templates = project && project.templates;
                const templatePR = templates && templates.prDescription;

                this.stepChangesDescription.resolve();

                if (templatePR) {
                    this.prDoc.description = templatePR.renderToString({
                        externalTicketURL: this.prDoc.parentTicket.externalURL,
                        externalTaskURL: this.prDoc.task.externalURL,
                        summary: this.prDoc.summary,
                        fileChanges: this.prDoc.fileChanges
                    });

                    const updated = await this.prDoc.updateDB({filter: { index: this.prDoc.index }, data: { description: this.prDoc.description }});
                    if (updated instanceof Error.Log) {
                        throw updated;
                    }
                }

                this.setters.stepCreatePR({ prDoc: this.prDoc });
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
