const _Global = require('@models/maps/_Global');
const CRUD = require('@CRUD');

class Stash extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'stashes'});
        if (!setup || isObjectID(setup)) return;

        const Task = require('./Task');
        const Repo = require('./Repo');

        try {
            const { stashIndex, type, title, gitName, description, branch, task, ticket, repo, backupFolder } = setup || {};
            const isIndexNaN = isNaN(stashIndex);

            this.stashIndex = !isIndexNaN ? String(stashIndex) : '';
            this.type = type;
            this.title = title;
            this.gitName = gitName;
            this.description = description;
            this.backupFolder = backupFolder;
            this.branch = branch;
            this.task = task && !isObjectID(task) && new Task(task);
            this.ticket = ticket && !isObjectID(ticket) && new Task(ticket);
            this.repo = repo && !isObjectID(repo) && new Repo(repo);

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Stash');
        }
    }

    setIndex(index) {
        const isIndexNaN = isNaN(index);

        if (isIndexNaN) {
            throw new Error.Log('common.number_expected', index);
        }

        this.stashIndex = !isIndexNaN ? String(index) : '';
    }

    static async create(setup = Stash.prototype) {
        try {
            const created = await require('@CRUD').create('stashes', setup);

            if (created instanceof Error.Log) {
                return created;
            }

            return created;
        } catch (err) {
            throw new Error.Log(err).append('stash.creating_loading');
        }
    }

    static async load(filter) {
        try {
            const stash = await CRUD.query({ collectionName: 'stashes', filter }).initialize();

            if (stash instanceof Error.Log) {
                throw stash;
            }

            return stash;
        } catch (err) {
            throw new Error.Log(err).append('stash.creating_loading');
        }
    }
}

module.exports = Stash;
