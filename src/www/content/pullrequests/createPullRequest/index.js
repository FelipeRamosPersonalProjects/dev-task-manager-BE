const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea } = require('@www/components/DocForm/FormField/fields');

class PullRequestCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createPullRequest.html');
    }

    constructor(settings) {
        super(settings);

        const {  } = Object(settings);

        this.docForm = new DocForm({
            collection: 'pullrequests',
            fields: [
            ]
        });
    }
}

module.exports = PullRequestCreate;
