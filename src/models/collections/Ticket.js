const _Global = require('../maps/_Global');

class Ticket extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'tickets'});
        if (!setup || isObjectID(setup)) return;

        const Project = require('./Project');
        const SpaceDesk = require('./SpaceDesk');
        const Task = require('./Task');
        const PullRequest = require('./PullRequest');
        const User = require('./User');
        const Comment = require('./Comment');
        const SLAModel = require('../maps/SLA');

        const {externalKey, externalURL, space, jiraIssue, project, displayName, title, description, status, sla, tasks, pullRequests, assignedUsers, comments} = new Object(setup);

        try {
            this.collectionName = 'tickets';
            this.externalURL = externalURL;
            this.externalKey = externalKey;
            this.title = title;
            this.displayName = displayName;
            this.description = description;
            this.status = status;
            this.jiraIssue = jiraIssue;
            this.space = !space.oid() ? new SpaceDesk(space) : {};
            this.project = !isObjectID(project) ? new Project(project) : {};
            this.sla = !isObjectID(sla) ? new SLAModel(sla) : {};
            this.tasks = Array.isArray(tasks) && !tasks.oid() && tasks.map(task => new Task(task));
            this.pullRequests = Array.isArray(pullRequests) && !pullRequests.oid() && pullRequests.map(pr => new PullRequest(pr)) || [];
            this.assignedUsers = Array.isArray(assignedUsers) && !assignedUsers.oid() && assignedUsers.map(user => new User(user)) || [];
            this.comments = Array.isArray(comments) && !comments.oid() && comments.map(comment => new Comment(comment)) || [];

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Ticket');
        }
    }

    async jiraCreateTicket() {
        try {
            for (let user of this.assignedUsers) {
                const jiraCreated = await user.jiraConnect.createIssue({
                    issueType: '10048',
                    externalKey: this.externalKey,
                    projectKey: this.space.jiraProject,
                    title: this.title,
                    description: this.description
                });

                await this.updateDB({ data: { jiraIssue: jiraCreated.data }});
                return jiraCreated;
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async jiraUpdateTicket(data) {
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

    async jiraTransitionStatus(event) {
        try {
            for (let user of this.assignedUsers) {
                const jiraUpdated = await user.jiraConnect.transitionIssue(this.jiraIssue.key, event);

                if (jiraUpdated instanceof Error.Log) {
                    throw jiraUpdated
                }

                return jiraUpdated;
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async transitionStatus(status) {
        try {
            return await this.updateDB({data: { status }});
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Ticket;
