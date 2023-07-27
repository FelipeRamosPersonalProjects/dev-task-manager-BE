const Component = require('@interface/Component');

class ProcessPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ProcessPR.html');
    }

    constructor(settings) {
        super(settings);

        const { isLoading, prDoc, modalTitle, modalContent, promptContent } = Object(settings);
        
        if (isLoading) {
            this.isLoading = 'Loading...';
        } else {
            this.modalTitle = modalTitle;
            this.modalContent = modalContent;
            this.promptContent = promptContent;
            this.setters.prDoc(prDoc);
        }
    }

    get setters() {
        return {
            prDoc: (value) => {
                this.prDoc = value || this.prDoc;
                const { title, summary, base, head, project, ticket, task } = Object(this.prDoc);
                
                this.title = title;
                this.summary = summary;
                this.base = base;
                this.head = head;
                this.base = base;
                this.project = project;
                this.ticket = ticket;
                this.task = task;
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
