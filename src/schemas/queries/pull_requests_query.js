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
            path: 'comments',
            model: 'comments'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
