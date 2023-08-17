const Component = require('@interface/Component');

class TicketTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./TicketTile.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, externalURL, frontURL } = Object(settings);
        
        this.displayName = displayName;
        this.externalURL = externalURL;
        this.frontURL = frontURL;
    }
}

module.exports = TicketTile;

