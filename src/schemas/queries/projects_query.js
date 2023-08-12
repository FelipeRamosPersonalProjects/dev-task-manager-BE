function defaultPopulate() {
    return this.populate([
        {
            path: 'tickets',
            model: 'tickets'
        },
        {
            path: 'tasks',
            model: 'tasks'
        },
        {
            path: 'repos',
            model: 'repos'
        },
        {
            path: 'spaceDesk',
            model: 'space_desks'
        },
        {
            path: 'organization',
            model: 'organizations'
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
    ])
}

module.exports = {
    defaultPopulate
};
