const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');

async function TicketsAndTasksView() {
    return new ViewCLI({
        name: 'ticketsAndTasks',
        Template: new DashedHeaderLayout({
            headerText: 'DevDESK CLI - Tickets and Tasks',
            headerDescription: `Manage your tickets and tasks.`
        }, this),
        navigator: { options: [
            { title: 'Create new ticket', targetView: 'crud/create', defaultData: { collectionName: 'tickets' } },
            { title: 'Open a ticket    ', targetView: 'tickets/readTicket' },
            { title: 'Create new task  ', targetView: 'crud/create', defaultData: { collectionName: 'tasks' } },
            { title: 'Open a task      ', targetView: 'tasks/readTask' }
        ]}
    }, this);
}

module.exports = TicketsAndTasksView;
