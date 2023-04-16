function defaultPopulate() {
    const populateConfig = [
        {
            path: 'task',
            ref: 'tasks'
        },
        {
            path: 'ticket',
            ref: 'tickets'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
