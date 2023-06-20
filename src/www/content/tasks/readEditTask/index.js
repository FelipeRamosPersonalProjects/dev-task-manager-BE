const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/tasks.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextArea } = require('@www/components/DocForm/FormField/fields');

class TaskEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditTask.html');
    }

    constructor(settings) {
        super(settings);

        const { taskDoc } = Object(settings);
        const {  } = Object(taskDoc);

        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'tasks',
            wrapperTag: 'div',
            fields: [
            ]
        });
    }
}

module.exports = TaskEdit;
