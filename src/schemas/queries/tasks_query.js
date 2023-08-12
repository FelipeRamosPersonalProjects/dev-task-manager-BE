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
                    model: 'space_desks',
                    populate: [
                        {
                            path: 'templates',
                            model: 'templates'
                        }
                    ]
                },
                {
                    path: 'prLabels',
                    model: 'labels'
                },
                {
                    path: 'reviewers',
                    model: 'users'
                },
                {
                    path: 'templates',
                    model: 'templates'
                }
            ]
        },
        {
            path: 'assignedUsers',
            model: 'users',
            populate: [
                {
                    path: 'auth',
                    model: 'auth_buckets'
                }
            ]
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
            model: 'repos',
            populate: [
                {
                    path: 'templates',
                    model: 'templates'
                }
            ]
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
