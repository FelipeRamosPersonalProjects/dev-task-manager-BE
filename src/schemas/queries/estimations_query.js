function defaultPopulate() {
    const populateConfig = [
        {
            path: 'ticket',
            model: 'tickets'
        },
        {
            path: 'assignedUsers',
            model: 'users'
        },
        {
            path: 'task',
            model: 'tasks'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
