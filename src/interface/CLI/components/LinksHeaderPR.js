const Component = require('@interface/Component');

class LinksHeaderPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/LinksHeaderPR.md');
    }

    constructor(settings) {
        super(settings);

        const { externalURL, externalURL, prLink, reviewers } = Object(settings);
        
        this.externalURL = externalURL;
        this.externalURL = externalURL;
        this.prLink = prLink;
        this.reviewers = reviewers;
    }
}

module.exports = LinksHeaderPR;
