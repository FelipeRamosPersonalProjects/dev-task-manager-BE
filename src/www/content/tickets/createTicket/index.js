const Component = require('@interface/Component');

class TicketCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createTicket.html');
    }

    constructor(settings) {
        super(settings);

        const {  } = Object(settings);
    }
}

module.exports = TicketCreate;
