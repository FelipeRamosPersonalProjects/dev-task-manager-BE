function defaultPopulate() {
    const populateConfig = [
        {
            path: 'owner',
            model: 'users'
        },
        {
            path: 'projects',
            model: 'projects'
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
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
