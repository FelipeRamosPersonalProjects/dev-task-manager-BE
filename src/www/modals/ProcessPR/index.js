const Component = require('@interface/Component');

class ProcessPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ProcessPR.html');
    }

    constructor(settings) {
        super(settings);

        const { modalTitle, modalContent } = Object(settings);
        
        this.modalTitle = modalTitle;
        this.modalContent = modalContent;
    }
}

module.exports = ProcessPR;
