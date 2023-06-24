function defaultPopulate() {
    const populateConfig = [
        {
            path: 'owner',
            model: 'users'
        },
        {
            path: 'projects',
            model: 'projects'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
