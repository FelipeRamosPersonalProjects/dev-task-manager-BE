const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea } = require('@www/components/DocForm/FormField/fields');

class CreateRepo extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createRepo.html');
    }

    constructor(settings) {
        super(settings);

        const { projects } = Object(settings);

        this.docForm = new DocForm({
            collection: 'repos',
            fields: [
                new SelectInput({
                    fieldName: 'project',
                    label: 'Project:',
                    options: projects.map(item => ({ label: item.projectName, value: item._id }))
                })
            ]
        });
    }
}

module.exports = CreateRepo;
