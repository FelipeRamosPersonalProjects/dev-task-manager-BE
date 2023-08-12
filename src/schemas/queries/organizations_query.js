function defaultPopulate() {
    const populateConfig = [
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
