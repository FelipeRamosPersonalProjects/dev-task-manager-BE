const _Global = require('@models/maps/_Global');

class CodeReview extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'code_reviews'}, parent);
        if (!setup || isObjectID(setup)) return;
        const PullRequest = require('./PullRequest');
        const Ticket = require('./Ticket');
        const Task = require('./Task');
        const Comment = require('./Comment');
        const User = require('./User');

        const {
            status,
            pullRequest,
            ticket,
            devTask,
            reviwer,
            reviwerComments
        } = Object(setup);
        
        try {
            this.status = status;
            this.pullRequest = pullRequest && !pullRequest.oid() && new PullRequest(pullRequest) || null;
            this.ticket = ticket && !ticket.oid() && new Ticket(ticket) || null;
            this.devTask = devTask && !devTask.oid() && new Task(devTask) || null;
            this.reviwer = reviwer && !reviwer.oid() && new User(reviwer) || null;
            this.reviwerComments = Array.isArray(reviwerComments) && !reviwerComments.oid() && reviwerComments.map(item => new Comment(item));

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'CodeReview');
        }
    }
}

module.exports = CodeReview;
