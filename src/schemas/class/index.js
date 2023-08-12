const GlobalClass = require('./GlobalClass');
const auth_buckets = require('./AuthBucketsClass');
const projects = require('./ProjectsClass');
const tasks = require('./TasksClass');
const repos = require('./ReposClass');
const organizations = require('./OrganizationsClass');
const threads = require('./ThreadsClass');
const space_desks = require('./SpaceDesksClass');
const logs = require('./LogsClass');
const labels = require('./LabelsClass');
const code_reviews = require('./CodeReviewsClass');
const sf_configs = require('./SfConfigsClass');
const tickets = require('./TicketsClass');
const estimations = require('./EstimationsClass');
const validations = require('./ValidationsClass');
const pull_requests = require('./PullRequestsClass');
const users = require('./UsersClass');
const comments = require('./CommentsClass');
const testing_steps = require('./TestingStepsClass');
const worklogs = require('./WorklogsClass');
const stashes = require('./StashesClass');
const templates = require('./TemplatesClass');

module.exports = {
    GlobalClass,
    auth_buckets,
    projects,
    tasks,
    repos,
    organizations,
    threads,
    space_desks,
    logs,
    labels,
    code_reviews,
    sf_configs,
    tickets,
    estimations,
    validations,
    pull_requests,
    users,
    comments,
    testing_steps,
    worklogs,
    stashes,
    templates
};
