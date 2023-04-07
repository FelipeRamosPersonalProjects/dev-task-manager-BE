const _Global = require('../maps/_Global');

class Stash extends _Global {
    constructor(setup = {
        ...this,
        user: Object,
        task: Object,
    }){
        super({...setup, validationRules: 'stashes'});
        const User = require('./User');
        const Task = require('./Task');
        const Repo = require('./Repo');

        if (!setup.isComplete) return;

        try {
            const { stashIndex, name, branch, user, task, repo } = setup || {};

            this.stashIndex = stashIndex;
            this.name = name;
            this.branch = branch;
            this.user = user && new User(user);
            this.task = task && new Task(task);
            this.repo = repo && new Repo(repo);

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Stash');
        }
    }
}

module.exports = Stash;
