const _Global = require('@models/maps/_Global');
const CRUD = require('@CRUD');
const config = require('@config');

class Stash extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'stashes'});
        if (!setup || isObjectID(setup)) return;

        const Task = require('./Task');
        const Repo = require('./Repo');
        const Ticket = require('./Ticket');

        try {
            const { stashIndex, type, title, description, branch, task, ticket, repo, backupFolder } = setup || {};
            const isIndexNaN = isNaN(stashIndex);

            this.collectionName = 'stashes';
            this.stashIndex = !isIndexNaN ? String(stashIndex) : '';
            this.type = type;
            this.title = title;
            this.description = description;
            this.backupFolder = backupFolder || config.backupFolder;
            this.branch = branch;
            this.task = task && !isObjectID(task) && new Task(task);
            this.ticket = ticket && !isObjectID(ticket) && new Ticket(ticket);
            this.repo = repo && !isObjectID(repo) && new Repo(repo, this.task);

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Stash');
        }
    }

    get displayName() {
        return this.title || this.gitName;
    }

    get stashManager() {
        return this.repo && this.repo.repoManager && this.repo.repoManager.stashManager;
    }

    get gitName() {
        return this.stashManager && this.stashManager.buildStashName({
            _id: this._id,
            type: this.type,
            externalKey: this.ticket && this.ticket.externalKey,
            externalKey: this.task && this.task.externalKey,
            taskVersion: this.task && this.task.taskVersion
        });
    }

    setIndex(index) {
        const isIndexNaN = isNaN(index);

        if (isIndexNaN) {
            throw new Error.Log('common.number_expected', index);
        }

        this.stashIndex = !isIndexNaN ? String(index) : '';
    }

    async apply() {
        try {
            const applied = await this.repo.repoManager.stashManager.applyStash(this);
            if(applied instanceof Error.Log) {
                throw applied;
            }

            return applied;
        } catch (err) {
            throw new Error.Log(err);
        }    
    }

    async drop() {
        try {
            const deletedDB = await this.deleteDB();
            if (deletedDB instanceof Error.Log) {
                throw deletedDB;
            }

            const dropped = await this.repo.repoManager.stashManager.drop(this.stashIndex);
            if(dropped instanceof Error.Log) {
                throw dropped;
            }

            return dropped;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async create(setup = Stash.prototype) {
        try {
            const created = await CRUD.create('stashes', setup);
            if (created instanceof Error.Log) {
                return created;
            }

            const createdPopulated = await created.defaultPopulate();
            if (createdPopulated instanceof Error.Log) {
                return createdPopulated;
            }

            return createdPopulated.initialize();
        } catch (err) {
            throw new Error.Log(err).append('stash.creating_loading');
        }
    }

    static async load(filter) {
        try {
            const stash = await CRUD.query({ collectionName: 'stashes', filter }).sort({createdAt: -1}).defaultPopulate();

            if (stash instanceof Error.Log) {
                throw stash;
            }

            return stash.map(item => item.initialize());
        } catch (err) {
            throw new Error.Log(err).append('stash.creating_loading');
        }
    }
}

module.exports = Stash;
