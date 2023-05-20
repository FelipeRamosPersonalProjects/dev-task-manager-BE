const _Global = require('../maps/_Global');
const User = require('./User');
const PullRequest = require('./PullRequest');
const Ticket = require('./Ticket');
const Task = require('./Task');

class Comment extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'comments'}, parent);
        if (!setup || isObjectID(setup)) return;

        try {
            const {
                body,
                parent,
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
                author
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
            this.user = user && new User(user);
            this.parent = parent && new Comment(parent);
            this.body = body;
            this.replies = Array.isArray(replies) && replies.map(reply => new Comment(reply));
            this.pullRequest = pullRequest && new PullRequest(pullRequest);
            this.ticket = ticket && new Ticket(ticket);
            this.task = task && new Task(task);

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Comment');
        }
    }
}

module.exports = Comment;
