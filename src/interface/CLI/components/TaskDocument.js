const Component = require('../../Component');

class TaskDocumentComponent extends Component {
    get SOURCE_PATH() {
        return 'src/interface/CLI/components/source/TaskDocument.component.txt';
    }

    constructor(settings = {
        ...Component.prototype
    }) {
        super(settings);
    }
}

module.exports = TaskDocumentComponent;
