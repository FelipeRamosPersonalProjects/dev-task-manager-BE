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
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
