const Ticket = require('../../models/collections/Ticket');

class TicketsClass {
    static Model = Ticket;

    get displayName() {
        return `[${this.externalKey}] ${this.title}`;
    }
}

module.exports = TicketsClass;
