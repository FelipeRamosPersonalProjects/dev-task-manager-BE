function defaultPopulate() {
    const populateConfig = [
        {
            path: 'project',
            model: 'projects',
            populate: [
                {
                    path: 'repos',
                    model: 'repos'
                },
                {
                    path: 'spaceDesk',
                    model: 'space_desks'
                },
                {
                    path: 'prLabels',
                    model: 'labels'
                },
                {
                    path: 'reviewers',
                    model: 'users'
                }
            ]
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
        },
        {
            path: 'repo',
            model: 'repos'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
