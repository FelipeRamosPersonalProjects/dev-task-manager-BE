const Component = require('@interface/Component');
const ListItem = require('@www/components/ListItem');

class Dashboard extends Component {
    get SOURCE_PATH() {
        return require.resolve('./dashboard.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets, tasks, pullRequests, projects } = Object(settings);

        this.tickets = tickets;
        this.tasks = tasks;
        this.pullRequests = pullRequests;
        this.projects = projects;
        this.types = {
            ListItem
        }
    }
}

module.exports = Dashboard;
