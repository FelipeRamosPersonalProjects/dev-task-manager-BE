const Component = require('@interface/Component');
const ListItem = require('@www/components/ListItem');

class Dashboard extends Component {
    get SOURCE_PATH() {
        return require.resolve('./dashboard.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets, tasks, pullRequests, projects, spaces } = Object(settings);

        this.tickets = Array.isArray(tickets) ? tickets.map(ticket => {
            ticket.url = `/tickets/read-edit/${ticket.index}`;
            return ticket;
        }) : [];
        this.tasks = tasks;
        this.pullRequests = pullRequests;
        this.projects = projects;
        this.spaces = spaces;
        this.types = {
            ListItem
        }
    }
}

module.exports = Dashboard;
