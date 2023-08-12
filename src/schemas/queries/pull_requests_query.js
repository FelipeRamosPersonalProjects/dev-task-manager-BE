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
                            model: 'space_desks',
                            populate: [
                                {
                                    path: 'templates',
                                    model: 'templates',
                                    populate: [
                                        {
                                            path: 'typeComponents',
                                            model: 'templates'
                                        }
                                    ]
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
                            model: 'templates',
                            populate: [
                                {
                                    path: 'typeComponents',
                                    model: 'templates'
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'repo',
                    model: 'repos',
                    populate: [
                        {
                            path: 'templates',
                            model: 'templates',
                            populate: [
                                {
                                    path: 'typeComponents',
                                    model: 'templates'
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'ticket',
                    model: 'tickets'
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
