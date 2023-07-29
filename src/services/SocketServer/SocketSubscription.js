const CRUD = require('@CRUD');
const crypto = require('crypto');

class SocketSubscription {
    constructor(setup, socket) {
        try {
            const { collectionName, filter } = Object(setup);

            this.subscriptionUID = crypto.randomBytes(8).toString('hex');
            this.socket = socket;
            this.collectionName = collectionName;
            this.filter = filter;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async trigger() {
        try {
            const doc = await this.handler();

            if (!doc) {
                this.socket.emit('subscribe:doc:null', new Error.Log({
                    name: 'NOT_FOUND',
                    message: `The document requested wasn't found!`
                }));
            }

            this.socket.emit('subscribe:doc:data', doc);
            return doc.toSuccess();
        } catch (err) {
            this.socket.emit('subscribe:doc:error', new Error.Log(err));
        }
    }

    async handler() {
        const { collectionName, filter } = Object(this);

        try {
            const docQuery = await CRUD.getDoc({ collectionName, filter }).defaultPopulate();
            const doc = docQuery.initialize();

            return doc;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = SocketSubscription;
