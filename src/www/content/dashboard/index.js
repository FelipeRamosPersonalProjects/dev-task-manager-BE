const Component = require('@interface/Component');
const ListItem = require('@www/components/ListItem');

class Dashboard extends Component {
    get SOURCE_PATH() {
        return require.resolve('./dashboard.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets, tasks, pullRequests, projects, spaces, repos, estimations, validations, templates } = Object(settings);

        this.tickets = tickets || [];
        this.tasks = tasks || [];
        this.pullRequests = pullRequests || [];
        this.projects = projects || [];
        this.repos = repos || [];
        this.spaces = spaces || [];
        this.estimations = estimations || [];
        this.validations = validations || [];
        this.templates = templates || [];
        this.types = {
            ListItem
        }
    }
}

module.exports = Dashboard;
