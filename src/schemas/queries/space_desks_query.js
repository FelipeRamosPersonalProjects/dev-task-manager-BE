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
            model: 'templates'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
