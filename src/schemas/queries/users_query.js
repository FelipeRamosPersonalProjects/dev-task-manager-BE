async function defaultPopulate() {
    const populateConfig = [
        {
            path: 'auth',
            model: 'auth_buckets'
        },
        {
            path: 'spaceDesks',
            model: 'space_desks'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
