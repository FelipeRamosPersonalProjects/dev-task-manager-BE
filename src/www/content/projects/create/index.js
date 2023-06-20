const Component = require('@interface/Component');
const SelectInput = require('@www/components/DocForm/FormField/SelectInput');

class ProjectCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./create.html');
    }

    constructor(settings) {
        super(settings);

        const { spaces, reviewers, prLabels } = Object(settings);

        this.spaces = new SelectInput({
            fieldName: 'spaceDesk',
            options: spaces.map(item => ({ label: item.spaceName, value: item.id }))
        }).renderToString();

        this.reviewers = reviewers;
        this.prLabels = prLabels;
    }
}

module.exports = ProjectCreate;
