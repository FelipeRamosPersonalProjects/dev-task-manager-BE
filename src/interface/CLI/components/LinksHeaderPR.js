const Component = require('@interface/Component');

class LinksHeaderPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/LinksHeaderPR.md');
    }

    constructor(settings) {
        super(settings);

        const { ticketURL, taskURL, prLink, reviewers } = Object(settings);
        
        this.ticketURL = ticketURL;
        this.taskURL = taskURL;
        this.prLink = prLink;
        this.reviewers = reviewers;
    }
}

module.exports = LinksHeaderPR;
