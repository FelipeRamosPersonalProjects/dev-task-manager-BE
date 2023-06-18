const Component = require('@interface/Component');

class LinksHeaderPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/LinksHeaderPR.md');
    }

    constructor(settings) {
        super(settings);

        const { externalURL, taskURL, prLink, reviewers } = Object(settings);
        
        this.externalURL = externalURL;
        this.taskURL = taskURL;
        this.prLink = prLink;
        this.reviewers = reviewers;
    }
}

module.exports = LinksHeaderPR;
