const Component = require('@interface/Component');
const Button = require('@www/components/DocForm/FormField/Button');

class TicketTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./TicketTile.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, externalURL } = Object(settings);
        
        this.displayName = displayName;
        this.externalURL = externalURL;
        this.openButton = new Button({
            label: 'Open Ticket'
        });
    }
}

module.exports = TicketTile;

