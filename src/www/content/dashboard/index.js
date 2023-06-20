const Component = require('@interface/Component');
const ListItem = require('@www/components/ListItem');

class Dashboard extends Component {
    get SOURCE_PATH() {
        return require.resolve('./dashboard.html');
    }

    constructor(settings) {
        super(settings);

        const { tickets, tasks, pullRequests, projects, spaces, repos } = Object(settings);

        this.tickets = Array.isArray(tickets) ? tickets.map(ticket => {
            ticket.url = `/tickets/read-edit/${ticket.index}`;
            return ticket;
        }) : [];
        this.tasks = Array.isArray(tasks) ? tasks.map(task => {
            task.url = `/tasks/read-edit/${task.index}`;
            return task;
        }) : [];
        this.pullRequests = Array.isArray(pullRequests) ? pullRequests.map(pullRequest => {
            pullRequest.url = `/pullRequests/read-edit/${pullRequest.index}`;
            return pullRequest;
        }) : [];
        this.projects = Array.isArray(projects) ? projects.map(project => {
            project.url = `/projects/read-edit/${project.index}`;
            return project;
        }) : [];
        this.repos = Array.isArray(repos) ? repos.map(repo => {
            repo.url = `/repos/read-edit/${repo.index}`;
            return repo;
        }) : [];
        this.spaces = Array.isArray(spaces) ? spaces.map(space => {
            space.url = `/spaces/read-edit/${space.index}`;
            return space;
        }) : [];
        this.types = {
            ListItem
        }
    }
}

module.exports = Dashboard;
