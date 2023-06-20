const Component = require('@interface/Component');
const SelectInput = require('@www/components/DocForm/FormField/SelectInput');

class CreateSpace extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createSpace.html');
    }

    constructor(settings) {
        super(settings);

        const { spaceName, jiraProjects, templates } = Object(settings);

        this.spaceName = spaceName;
        this.templates = templates;
        this.jiraProjects = new SelectInput({
            fieldName: 'jiraProject',
            options: jiraProjects.map(item => ({ label: item.name, value: item.key }))
        }).renderToString();
    }
}

module.exports = CreateSpace;
