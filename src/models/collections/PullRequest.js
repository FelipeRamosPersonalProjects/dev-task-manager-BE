const _Global = require('../maps/_Global');
const CRUD = require('@CRUD');
const dbHelpers = require('@helpers/database/dbHelpers');

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

            if (typeof description === 'string') {
                this.description = description;
            } else {
                this.description = description && description.toMarkdown({
                    externalURL: ticket.externalURL,
                    externalURL: task.externalURL,
                    summary: task.description,
                    fileChanges
                });
            }

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'PullRequests');
        }
    }

    get displayName() {
        return this.title;
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
        const descriptionTemplate = this.project.getTemplate('prDescription');
        const newDescription = descriptionTemplate.renderToString({
            externalTicketURL: this.parentTicket.externalURL,
            externalTaskURL: this.task.externalURL,
            summary: this.summary,
            fileChanges: this.fileChanges
        });

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

    async publishPR() {
        try {
            const published = await this.repoManager.createPullRequest({
                owner: this.repoManager.userName,
                repo: this.repo.repoName,
                title: this.name,
                body: this.description,
                head: this.head,
                base: this.base,
                labels: this.getSafe('project.prLabels'),
                reviewers: this.getSafe('project.reviewers')
            });

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
