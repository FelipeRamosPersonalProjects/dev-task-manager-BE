function defaultPopulate() {
    const config = [
        {
            path: 'tasks',
            model: 'tasks'
        },
        {
            path: 'project',
            model: 'projects'
        },
        {
            path: 'pullRequests',
            model: 'pull_requests'
        },
        {
            path: 'assignedUsers',
            model: 'users'
        },
        {
            path: 'comments',
            model: 'comments'
        }
    ]

    return this.populate(config);
}

module.exports = {
    defaultPopulate
};
