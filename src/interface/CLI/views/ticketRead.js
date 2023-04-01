const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const DisplayDocument = require('../components/DisplayDocument');
const CRUD = require('../../../services/database/crud');
const ToolsCLI = require('../ToolsCLI');
const tools = new ToolsCLI();

async function TicketRead(params) {
    tools.print('Loading view resources...');
    const { ticketUID } = params || {};

    try {
        const ticket = await CRUD.getDoc({ collectionName: 'tickets', filter: '64271b1ee10a8832c9e442bf' }).initialize();
    
        return new ViewCLI({
            name: 'ticketRead',
            Template: new DashedHeaderLayout({
                componentName: 'Ticket View',
                headerText: 'TICKETS:\n    ' + ticket.displayName,
                headerDescription: 'Ticket URL: ' + ticket.ticketURL,
                Content: new DisplayDocument({
                    document: ticket
                })
            }),
            navigator: new ViewCLI.ViewNavigator({
                options: [
                    {
                        title: 'Go back to home view',
                        description: 'You will be redirected to the home view!',
                        targetView: this.startView
                    },
                    {
                        title: 'Search tickets',
                        description: 'Go to the search tickets view!',
                        targetView: 'crud/search'
                    },
                    {
                        index: 'prev',
                        title: 'Previous ticket',
                        description: 'Go to the search tickets view!',
                        targetView: 'crud/search'
                    },
                    {
                        index: 'next',
                        title: 'Next ticket',
                        description: 'Go to the search tickets view!',
                        targetView: 'crud/search'
                    }
                ]
            }, this)
        }, this);
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = TicketRead;
