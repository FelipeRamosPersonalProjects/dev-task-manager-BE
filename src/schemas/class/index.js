const GlobalClass = require('./GlobalClass');
const logs = require('./LogsClass');
const auth_buckets = require('./AuthBucketsClass');
const users = require('./UsersClass');
const space_desks = require('./SpaceDesksClass');
const organizations = require('./OrganizationsClass');
const tickets = require('./TicketsClass');
const comments = require('./CommentsClass');
const projects = require('./ProjectsClass');
const pull_requests = require('./PullRequestsClass');
const repos = require('./ReposClass');
const components = require('./ComponentsClass');
const estimations = require('./EstimationsClass');
const tasks = require('./TasksClass');
const stashes = require('./StashesClass');

module.exports = {
    GlobalClass,
    logs,
    space_desks,
    organizations,
    tickets,
    comments,
    projects,
    pull_requests,
    repos,
    components,
    estimations,
    tasks,
    stashes,
    auth_buckets,
    users
};
