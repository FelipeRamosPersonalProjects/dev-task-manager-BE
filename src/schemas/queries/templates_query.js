function defaultPopulate() {
    const populateConfig = [
        {
            path: 'projects',
            model: 'projects'
        },
        {
            path: 'spaces',
            model: 'space_desks'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
