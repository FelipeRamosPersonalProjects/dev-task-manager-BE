const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/pullrequests.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextArea } = require('@www/components/DocForm/FormField/fields');

class PullRequestEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditPullRequest.html');
    }

    constructor(settings) {
        super(settings);

        const { pullRequestDoc } = Object(settings);
        const {  } = Object(pullRequestDoc);

        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'pull_requests',
            wrapperTag: 'div',
            fields: [
            ]
        });
    }
}

module.exports = PullRequestEdit;
