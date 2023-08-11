function defaultPopulate() {
    const populateConfig = [
        {
            path: 'task',
            model: 'tasks',
            populate: [
                {
                    path: 'project',
                    model: 'projects',
                    populate: [
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
                    path: 'repo',
                    model: 'repos'
                }
            ]
        },
        {
            path: 'ticket',
            model: 'tickets'
        },
        {
            path: 'assignedUsers',
            model: 'users'
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
