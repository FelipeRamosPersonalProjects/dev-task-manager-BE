function defaultPopulate() {
    return this.populate([
        {
            path: 'ticket',
            model: 'tickets'
        },
        {
            path: 'task',
            model: 'tasks'
        },
        {
            path: 'repo',
            model: 'repos'
        }
    ]);
}

module.exports = {
    defaultPopulate
};
