const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { InputEdit, MultiRelation } = require('@www/components/DocForm/FormField/fields');

class ReadEditRepo extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditRepo.html');
    }

    constructor(settings) {
        super(settings);

        const { repoDoc } = Object(settings);
        const { _id, displayName, projects, baseBranch, nodeVersion, url, repoName, repoPath, templates } = Object(repoDoc);

        this.UID = _id;
        this.collection = repoDoc.getSafe('ModelDB.modelName');
        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: this.collection,
            wrapperTag: 'div',
            fields: [
                new InputEdit({
                    fieldName: 'baseBranch',
                    label: 'Base Branch:',
                    currentValue: baseBranch
                }),
                new InputEdit({
                    fieldName: 'nodeVersion',
                    label: 'Node Version:',
                    currentValue: nodeVersion
                }),
                new InputEdit({
                    fieldName: 'url',
                    label: 'Repository URL:',
                    currentValue: url
                }),
                new InputEdit({
                    fieldName: 'repoName',
                    label: 'Repository Name:',
                    currentValue: repoName
                }),
                new InputEdit({
                    fieldName: 'repoPath',
                    label: 'Repository Path:',
                    currentValue: repoPath
                }),
                new MultiRelation({
                    view: 'read',
                    fieldName: 'projects',
                    label: 'Projects:',
                    currentValue: projects,
                    options: settings.projects
                }),
                new MultiRelation({
                    view: 'read',
                    fieldName: 'templates',
                    label: 'Templates:',
                    currentValue: templates,
                    options: settings.templates
                })
            ]
        });
    }
}

module.exports = ReadEditRepo;
