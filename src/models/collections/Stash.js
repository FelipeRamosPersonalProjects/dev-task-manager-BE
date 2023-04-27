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

    get stashManager() {
        return this.repo && this.repo.repoManager && this.repo.repoManager.stashManager;
    }

    get gitName() {
        return this.stashManager && this.stashManager.buildStashName({
            _id: this._id,
            type: this.type,
            ticketID: this.ticket && this.ticket.ticketID,
            taskID: this.task && this.task.taskID,
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
