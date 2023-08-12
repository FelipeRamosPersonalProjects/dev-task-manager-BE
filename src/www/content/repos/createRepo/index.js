const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class CreateRepo extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createRepo.html');
    }

    constructor(settings) {
        super(settings);

        const { projects, templates } = Object(settings);

        this.docForm = new DocForm({
            collection: 'repos',
            fields: [
                new Input({
                    fieldName: 'baseBranch',
                    label: 'Base Branch:'
                }),
                new Input({
                    fieldName: 'nodeVersion',
                    label: 'Node Version:'
                }),
                new Input({
                    fieldName: 'url',
                    label: 'Repository URL:'
                }),
                new Input({
                    fieldName: 'repoName',
                    label: 'Repository Name:'
                }),
                new Input({
                    fieldName: 'repoPath',
                    label: 'Repository Path:'
                }),
                new MultiRelation({
                    fieldName: 'projects',
                    label: 'Project:',
                    options: projects
                }),
                new MultiRelation({
                    fieldName: 'templates',
                    label: 'Templates:',
                    options: templates
                })
            ]
        });
    }
}

module.exports = CreateRepo;
