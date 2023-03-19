const _Global = require('../maps/_Global');

class Comment extends _Global {
    constructor(setup = {
        ...Comment.prototype,
        parent: Comment.prototype,
        message: String
    }){
        try {
            super({...setup, validationRules: 'comments'});
            const { message, parent } = setup || {};

            this.parent = parent;
            this.message = message;

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Comment');
        }
    }
}

module.exports = Comment;
