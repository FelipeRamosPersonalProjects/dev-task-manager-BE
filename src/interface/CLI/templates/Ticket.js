const Component = require('@interface/Component');
const DashedHeader = require('@CLI/components/DashedHeader');

class TicketTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/Ticket.md');
    }

    constructor(settings) {
        super(settings);

        const { displayName } = new Object(settings || {});

        this.Header = new DashedHeader({
            headerText: displayName,
            headerDescription: `Check below the ticket's data loaded.`
        });
    }
}

module.exports = TicketTemplate;
