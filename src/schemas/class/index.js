const GlobalClass = require('./GlobalClass');
const auth_buckets = require('./AuthBucketsClass');
const users = require('./UsersClass');
const repos = require('./ReposClass');
const projects = require('./ProjectsClass');
const tickets = require('./TicketsClass');
const tasks = require('./TasksClass');
const pull_requests = require('./PullRequestsClass');
const comments = require('./CommentsClass');
const components = require('./ComponentsClass');
const estimations = require('./EstimationsClass');
const validations = require('./ValidationsClass');
const stashes = require('./StashesClass');
const space_desks = require('./SpaceDesksClass');
const organizations = require('./OrganizationsClass');
const logs = require('./LogsClass');
const threads = require('./ThreadsClass');
const worklogs = require('./WorklogsClass');
const code_reviews = require('./CodeReviewsClass');
const labels = require('./LabelsClass');
const sf_configs = require('./SfConfigsClass');

module.exports = {
    GlobalClass,
    auth_buckets,
    users,
    repos,
    projects,
    tickets,
    tasks,
    pull_requests,
    comments,
    components,
    estimations,
    validations,
    stashes,
    space_desks,
    organizations,
    logs,
    threads,
    worklogs,
    code_reviews,
    labels,
    sf_configs
};
