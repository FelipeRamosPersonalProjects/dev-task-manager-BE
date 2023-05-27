const _Global = require('../maps/_Global');
const CRUD = require('@CRUD');

class Comment extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'comments'}, parent);
        if (!setup || isObjectID(setup)) return;
        const User = require('./User');
        const PullRequest = require('./PullRequest');
        const Ticket = require('./Ticket');
        const Task = require('./Task');

        try {
            const {
                body,
                replies,
                parentComment,
                user,
                pullRequest,
                ticket,
                task,
                source,
                commentType,
                sourceID,
                nodeID,
                diffHunk,
                filePath,
                sourceCreatedAt,
                sourceUpdatedAt,
                author,
                gitHub
            } = Object(setup);

            this.source = source;
            this.commentType = commentType;
            this.sourceID = sourceID;
            this.nodeID = nodeID;
            this.diffHunk = diffHunk;
            this.filePath = filePath;
            this.sourceCreatedAt = sourceCreatedAt;
            this.sourceUpdatedAt = sourceUpdatedAt;
            this.author = author;
            this.user = !Object(user).oid() && new User(user) || null;
            this.parentComment = !Object(parentComment).oid() && new Comment(parentComment) || null;
            this.body = body;
            this.replies = Array.isArray(replies) && replies.map(reply => new Comment(reply)) || [];
            this.pullRequest = !Object(pullRequest).oid() && new PullRequest(pullRequest) || null;
            this.ticket = !Object(ticket).oid() && new Ticket(ticket) || null;
            this.task = !Object(task).oid() && new Task(task) || null;
            this.gitHub = gitHub;

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Comment');
        }
    }

    get gitHubID() {
        return this.gitHub.id;
    }

    static async updateFromGitHubPR(filter, gitHubData) {
        const { body } = Object(gitHubData);

        try {
            return await CRUD.update({collectionName: 'comments', filter, data: {
                body,
                gitHub: gitHubData
            }});
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async createFromGitHubPR(params) {
        const User = require('./User');
        const { data, ticket, task, pullRequest } = Object(params);
        const { body } = Object(data);

        if (!data || !ticket || !task || !pullRequest) {
            throw new Error.Log('common.missing_params', ['data', 'ticket', 'task', 'pullRequest'], 'createFromGitHubPR', 'Comment.js');
        }

        try {
            const toSave = {
                source: 'GITHUB',
                commentType: 'PR',
                body,
                author: User.currentUser(),
                gitHub: data,
                ticket,
                task,
                pullRequest
            };

            const saved = await CRUD.create('comments', toSave );
            if (saved instanceof Error.Log) {
                throw saved;
            }

            return saved.initialize();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Comment;
