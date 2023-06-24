const Ticket = require('../../models/collections/Ticket');

class TicketsClass {
    static Model = Ticket;

    get displayName() {
        return `[${this.externalKey || this.cod}] ${this.title}`;
    }
    
    get frontURL() {
        return `/tickets/read-edit/${this.index}`;
    }
}

module.exports = TicketsClass;
