const Component = require('@interface/Component');

class PullRequestStatusComponent extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/PullRequestStatus.md');
    }

    constructor(settings) {
        super(settings);

        const { displayName, status } = Object(settings);
        
        this.displayName = displayName;
        this.status = status;
    }
}

module.exports = PullRequestStatusComponent;
