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
            path: 'tasks',
            model: 'tasks'
        },
        {
            path: 'pullRequest',
            model: 'pull_requests'
        },
        {
            path: 'testingSteps',
            model: 'testing_steps'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
