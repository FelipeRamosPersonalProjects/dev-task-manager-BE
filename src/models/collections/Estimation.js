const _Global = require('../maps/_Global');
const CRUD = require('@CRUD');
const Ticket = require('./Ticket');
const Task = require('./Task');
const User = require('./User');

class Estimation extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'estimations'}, () => this);
        if (!setup || Object(setup).oid()) return;

        try {
            const {
                frontURL,
                type,
                status,
                jiraIssue,
                title,
                description,
                FE,
                BE,
                QA,
                others,
                totalEstimation,
                fullEstimation,
                parsedTime,
                unit,
                ticket,
                task,
                assignedUsers
            } = Object(setup);

            this.collectionName = 'estimations';
            this.jiraIssueType = '10053';
            this.jiraIssue = jiraIssue;
            this.frontURL = frontURL;
            this.type = type;
            this.unit = unit;
            this.status = status;
            this.title = title;
            this.description = description;
            this.FE = FE;
            this.BE = BE;
            this.QA = QA;
            this.others = others;
            this.totalEstimation = totalEstimation;
            this.fullEstimation = fullEstimation;
            this.parsedTime = parsedTime;
            this.ticket = !Object(ticket).oid() ? new Ticket(ticket) : null;
            this.task = !Object(task).oid() ? new Task(task) : null;
            this.assignedUsers = Array.isArray(assignedUsers) && !assignedUsers.oid() ? assignedUsers.map(item => new User(item)) : [];

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Estimation');
        }
    }

    get displayName() {
        return `[${this.getSafe('ticket.externalKey')}] ${this.title}`;
    }

    async jiraCreate() {
        try {
            for (let user of this.assignedUsers) {
                const jiraCreated = await user.jiraConnect.createIssue({
                    issueType: this.jiraIssueType,
                    parentKey: this.getSafe('ticket.jiraIssue.id'),
                    externalKey: this.getSafe('ticket.externalKey'),
                    projectKey: this.getSafe('ticket.space.jiraProject'),
                    title: this.displayName,
                    description: this.description || ''
                });

                await this.updateDB({ data: { jiraIssue: jiraCreated.data }});
                return jiraCreated;
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async jiraUpdate(data) {
        try {
            for (let user of this.assignedUsers) {
                const jiraUpdated = await user.jiraConnect.updateIssue(this.jiraIssue.key, data);

                if (jiraUpdated instanceof Error.Log) {
                    throw jiraUpdated
                }

                return jiraUpdated;
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async create(data) {
        try {
            const estimation = await CRUD.create('estimations', data);

            if (estimation instanceof Error.Log) {
                throw estimation
            }

            return estimation;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Estimation;
