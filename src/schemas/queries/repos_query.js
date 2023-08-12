function defaultPopulate() {
    const populateConfig = [
        {
            path: 'projects',
            model: 'projects'
        },
        {
            path: 'owner',
            model: 'users'
        },
        {
            path: 'collaborators',
            model: 'users'
        },
        {
            path: 'templates',
            model: 'templates'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
