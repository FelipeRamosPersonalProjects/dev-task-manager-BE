const Component = require('@interface/Component');

class LinksHeaderPR extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/LinksHeaderPR.md');
    }

    constructor(settings) {
        super(settings, {
            ticketURL: { type: String },
            taskURL: { type: String },
            prLink: { type: String },
        });

        const { ticketURL, taskURL, prLink } = Object(settings || {});
        
        this.ticketURL = ticketURL;
        this.taskURL = taskURL;
        this.prLink = prLink;
    }
}

module.exports = LinksHeaderPR;
