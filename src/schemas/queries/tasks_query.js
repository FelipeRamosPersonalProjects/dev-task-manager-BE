function defaultPopulate() {
    const populateConfig = [
        {
            path: 'project',
            model: 'projects',
            populate: [{
                path: 'repos',
                model: 'repos',
            }]
        },
        {
            path: 'assignedUsers',
            model: 'users'
        },
        {
            path: 'ticket',
            model: 'tickets'
        },
        {
            path: 'estimations',
            model: 'estimations'
        },
        {
            path: 'pullRequests',
            model: 'pull_requests'
        },
        {
            path: 'comments',
            model: 'comments'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
