const Component = require('@interface/Component');
const PullRequestStatus = require('@CLI/components/tiles/PullRequestStatus');

class HomeContent extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/HomeContent.md');
    }

    constructor(settings) {
        super(settings);

        const { openedPRs } = Object(settings);
        
        this.openedPRs = openedPRs;
        this.types = {
            PullRequestStatus
        }
    }
}

module.exports = HomeContent;
