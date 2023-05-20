const _Global = require('@models/maps/_Global');
const Comment = require('@models/collections/Comment');

class Thread extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'threads'}, parent);
        
        if (!setup || isObjectID(setup)) return;
        const { parentComment, childComments } = Object(setup);
        
        try {
            this.parentComment = parentComment ? parentComment.oid(true) : {};
            this.children = childComments.oid() ? parentComment.map(parent => new Comment(parent)) : {};

            this.placeDefault();
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Thread');
        }
    }
}

module.exports = Thread;
