const ViewCLI = require('@CLI/ViewCLI');
const TicketTemplate = require('@CLI/templates/Ticket');
const CRUD = require('@CRUD');

async function ReadTicketView() {
    const view = new ViewCLI({
        name: 'tickets/readTicket',
        poolForm: {
            questions: [{
                id: 'searchTicket',
                required: true,
                text: `Enter the ticket ID, URL or task ID: `,
                events: {
                    onAnswer: async (ev, _, answer) => {
                        try {
                            const query = await CRUD.query({collectionName: 'tickets', filter: {
                                $or: [
                                    { externalKey: answer },
                                    { externalURL: answer }
                                ]
                            }}).defaultPopulate();
                            if (query instanceof Error.Log) {
                                throw query;
                            }
                            
                            if (query.length) {
                                const tickets = query.map(item => item.initialize());
                                if (tickets instanceof Error.Log) {
                                    throw tickets;
                                }

                                ev.setValue('ticket', tickets[0]);
                            }
                        } catch (err) {
                            throw new Error.Log(err);
                        }
                    }
                }
            }],
            events: {
                onEnd: async (ev) => {
                    try {
                        const ticket = ev.getValue('ticket');

                        if (ticket) {
                            const template = new TicketTemplate(ticket);
                            
                            template.printOnScreen();
                        }
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }
        }
    }, this);

    return view;
}

module.exports = ReadTicketView;
