const _Global = require('../maps/_Global');
const CRUD = require('../../services/database/crud');

class Stash extends _Global {
    constructor(setup){
        if (!setup || isObjectID(setup)) return;
        super({...setup, validationRules: 'stashes'});

        const Task = require('./Task');
        const Repo = require('./Repo');

        try {
            const { stashIndex, type, name, description, branch, task, repo } = setup || {};
            const isIndexNaN = isNaN(stashIndex);

            this.stashIndex = !isIndexNaN ? String(stashIndex) : '';
            this.type = type;
            this.name = name;
            this.description = description;
            this.branch = branch;

            if (!this.isNew) {
                this.task = task && new Task(task);
                this.repo = repo && new Repo(repo);
            } else {
                this.task = task;
                this.repo = repo;
            }

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
            const newStash = new Stash({...setup, isNew: true});
            const created = await newStash.saveDB('stashes');

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
