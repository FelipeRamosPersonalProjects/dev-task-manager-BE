const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea } = require('@www/components/DocForm/FormField/fields');

class TaskCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTask.html');
    }

    constructor(settings) {
        super(settings);

        const {  } = Object(settings);

        this.docForm = new DocForm({
            collection: 'tickets',
            fields: [
            ]
        });
    }
}

module.exports = TaskCreate;
