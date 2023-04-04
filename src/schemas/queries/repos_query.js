function defaultPopulate() {
    const populateConfig = [
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
