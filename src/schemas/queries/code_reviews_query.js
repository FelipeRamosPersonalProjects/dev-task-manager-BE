function defaultPopulate() {
    const populateConfig = [
        {
            path: 'pullRequest',
            model: 'pull_requests'
        },
        {
            path: 'ticket',
            model: 'tickets'
        },
        {
            path: 'devTask',
            model: 'tasks'
        },
        {
            path: 'reviwer',
            model: 'users'
        },
        {
            path: 'reviwerComments',
            model: 'comments'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
