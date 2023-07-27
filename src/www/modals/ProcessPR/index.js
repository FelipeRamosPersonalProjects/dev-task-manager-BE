const Component = require('@interface/Component');

class ProcessPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ProcessPR.html');
    }

    constructor(settings) {
        super(settings);

        const { prDoc, modalTitle, promptContent } = Object(settings);
        const {  } = Object(prDoc);
        
        this.modalTitle = modalTitle;
        this.promptContent = promptContent;
    }
}

module.exports = ProcessPR;
