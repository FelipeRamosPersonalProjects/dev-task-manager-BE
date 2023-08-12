const _Global = require('../maps/_Global');
const CRUD = require('@CRUD');
const dbHelpers = require('@helpers/database/dbHelpers');
const Component = require('@interface/Component');

class PullRequest extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'pull_requests'}, parent);
        if (!setup || Object(setup).oid()) return;

        const User = require('./User');
        const Ticket = require('./Ticket');
        const Task = require('./Task');
        const Comment = require('./Comment');
        const Label = require('./Label');
        const FileChange = require('@services/GitHubAPI/FileChange');

        const {
            status,
            state,
            title,
            head,
            base,
            remoteID,
            prStage,
            frontURL,
            isCurrentVersion,
            version,
            summary,
            description,
            fileChanges,
            assignedUsers,
            reviewers,
            labels,
            sfccConfigs,
            comments,
            ticket,
            task,
            gitHubPR,
            logsHistory
        } = Object(setup || {});

        try {
            this.collectionName = 'pull_requests';
            this.state = state;
            this.gitHubPR = gitHubPR;
            this.frontURL = frontURL;
            this.title = title;
            this.remoteID = remoteID;
            this.status = status;
            this.prStage = prStage;
            this.isCurrentVersion = isCurrentVersion;
            this.version = version;
            this.summary = summary;
            this.head = head;
            this.base = base;
            this.sfccConfigs = sfccConfigs;
            this.labels = Array.isArray(labels) && !labels.oid() && labels.map(label => new Label(label, this));
            this.fileChanges = Array.isArray(fileChanges) && !fileChanges.oid() && fileChanges.map(change => new FileChange(change, this));
            this.assignedUsers = Array.isArray(assignedUsers) && !assignedUsers.oid() && assignedUsers.map(user => new User(user, this));
            this.reviewers = Array.isArray(reviewers) && !reviewers.oid() && reviewers.map(user => new User(user, this));
            this.comments = Array.isArray(comments) && !comments.oid() && comments.map(comment => new Comment(comment, this));
            this.ticket = !Object(ticket).oid() && new Ticket(ticket, this);
            this.task = !Object(task).oid() && new Task(task, this);
            this.logsHistory = logsHistory || [];

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'PullRequests');
        }
    }

    get displayName() {
        if (this.title) {
            return this.title;
        }

        const projectTemplates = this.project && this.project.templates;
        const spaceTemplates = this.project && this.project.spaceDesk && this.project.spaceDesk.templates;
        let template;

        if (projectTemplates && projectTemplates.length) {
            const filterTemplates = projectTemplates.filter(item => item.type === 'pr-title');
            template = filterTemplates.length ? filterTemplates[0].Component : null;
        } else if (spaceTemplates && spaceTemplates.length) {
            const filterTemplates = spaceTemplates.filter(item => item.type === 'pr-title');
            template = filterTemplates.length ? filterTemplates[0].Component : null;
        }

        if (template instanceof Component) {
            return template.renderToString(this);
        }
    }

    get autoDescription() {
        if (this.description) {
            return this.description;
        }

        const projectTemplates = this.project && this.project.templates;
        const spaceTemplates = this.project && this.project.spaceDesk && this.project.spaceDesk.templates;
        let template;

        if (projectTemplates && projectTemplates.length) {
            const filterTemplates = projectTemplates.filter(item => item.type === 'pr-description');
            template = filterTemplates.length ? filterTemplates[0].Component : null;
        } else if (spaceTemplates && spaceTemplates.length) {
            const filterTemplates = spaceTemplates.filter(item => item.type === 'pr-description');
            template = filterTemplates.length ? filterTemplates[0].Component : null;
        }

        if (template instanceof Component) {
            return template.renderToString(this);
        }
    }

    get recommendedBranchName() {
        let result = 'feature/'

        if (this.version > 1) {
            result += this.task.externalKey + '-v' + this.version;
        } else {
            result += this.task.externalKey;
        }

        return result;
    }

    get externalTicketURL() {
        if (this.ticket) {
            return this.ticket.externalURL;
        }
    }

    get externalTaskURL() {
        if (this.task) {
            return this.task.externalURL;
        }
    }

    get externalTicketKey() {
        if (this.ticket) {
            return this.ticket.externalKey;
        }
    }

    get externalTaskKey() {
        if (this.task) {
            return this.task.externalKey;
        }
    }

    get taskTitle() {
        if (this.task) {
            return this.task.displayName;
        }
    }

    get repoManager() {
        return this.task && this.task.repo.repoManager;
    }

    get repo() {
        return this.task && this.task.repo;
    }

    get parentTicket() {
        if (Object.keys(this.ticket || {}).length) {
            return this.ticket;
        }

        if (Object.keys(this.task || {}).length) {
            return this.task.ticket;
        }
    }

    get project() {
        return this.task && this.task.project && this.task.project;
    }

    async updateDescription(dontSave) {
        const newDescription = this.autoDescription;

        if (!dontSave) {
            const updatedDescription = await this.updateDB({ data: {
                description: newDescription,
                fileChanges: this.fileChanges
            }});
    
            if (updatedDescription instanceof Error.Log) {
                updatedDescription.consolePrint();
                throw updatedDescription;
            }
    
            this.description = newDescription;
            return this;
        } else {
            this.description = newDescription;
            return this;
        }
    }

    async saveRemoteData(published) {
        this.gitHubPR = published;

        try {
            const updatedRemote = await this.updateDB({data: { gitHubPR: published }});
            if (updatedRemote instanceof Error.Log) {
                updatedRemote.consolePrint();
                throw updatedRemote;
            }

            return this;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async updateReviewComments(internalPR) {
        try {
            if (!this.gitHubPR || !this.gitHubPR.review_comments_url) {
                return [];
            }

            const remoteComments = await this.repoManager.ajax(this.gitHubPR.review_comments_url, null, {rawURL: true});
            const toSave = [];

            
            for (let comment of remoteComments) {
                const isExist = await dbHelpers.isDocExist('comments', { 'gitHub.id': comment.id });

                if (!isExist) {
                    toSave.push(Comment.createFromGitHubPR({
                        data: comment,
                        ticket: this.ticket._id,
                        task: this.task._id,
                        pullRequest: this._id
                    }));
                } else {
                    const internalComment = internalPR.comments.find(item => item.gitHubID === comment.id);

                    if (JSON.stringify(internalComment.gitHub) !== JSON.stringify(comment)) {
                        toSave.push(Comment.updateFromGitHubPR({ 'gitHub.id': comment.id }, comment));
                    }
                }
            }

            return Promise.all(toSave);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async changeStage(newStage) {
        if (!newStage) {
            throw new Error.Log('common.missing_params', 'newStage', 'PullRequest.changeStage', 'PullRequest.js');
        }

        try {
            const updated = await this.updateDB({data: {
                prStage: newStage,
                isCurrentVersion: !(newStage === 'aborted')
            }});

            if (updated instanceof Error.Log) {
                return updated;
            }

            this.prStage = newStage;
            return this;
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    async publishPR(options) {
        try {
            const published = await this.repoManager.createPullRequest({
                owner: this.repoManager.userName,
                repo: this.repo.repoName,
                title: this.displayName,
                body: this.autoDescription,
                head: this.head,
                base: this.base,
                assignees: this.assignedUsers.map(user => user.gitHubUser),
                labels: this.getSafe('project.prLabels') || [],
                reviewers: this.getSafe('project.reviewers') || []
            }, options);

            if (published instanceof Error.Log) {
                published.consolePrint();
                throw published;
            }

            const updatedPR = await this.saveRemoteData(published);
            if (updatedPR instanceof Error.Log) {
                updatedPR.consolePrint();
                throw updatedPR;
            }

            return updatedPR;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async deletePR() {
        try {
            const deleted = await this.deleteDB();
            return deleted;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async updateVersion(newVersion) {
        if (!newVersion) return;

        try {
            const updated = await CRUD.update({collectionName: 'pull_requests', filter: { index: this.index }, data: {
                version: newVersion,
                head: this.recommendedBranchName
            }});

            if (updated.success) {
                return updated;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async save(data = PullRequest.prototype) {
        try {
            const saved = await CRUD.create('pull_requests', data || {});
            if (saved instanceof Error.Log) {
                throw saved;
            }

            return saved.initialize();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = PullRequest;
