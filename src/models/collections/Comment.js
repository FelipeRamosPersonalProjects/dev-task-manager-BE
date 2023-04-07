const _Global = require('../maps/_Global');
const User = require('./User');
const PullRequest = require('./PullRequest');
const Ticket = require('./Ticket');
const Task = require('./Task');

class Comment extends _Global {
    constructor(setup = {
        ...Comment.prototype,
        user: User.prototype,
        parent: Comment.prototype,
        message: '',
        replies: [Comment.prototype],
        pullRequest: PullRequest.prototype,
        ticket: Ticket.prototype,
        task: Task.prototype,
    }){
        super({...setup, validationRules: 'comments'});
        if (!setup.isComplete && !setup.isNew) return;

        try {
            const { message, parent, user, pullRequest, ticket, task } = setup || {};

            this.user = user && new User(user);
            this.parent = parent && new Comment(parent);
            this.message = message;
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
