const SocketSubscription = require('./SocketSubscription');

class SocketConnection {
    constructor(socket, serverInstance) {
        try {
            this._serverInstance = () => serverInstance;
            this.socket = socket;
            this.subscriptions = [];

            this.init();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get serverInstance() {
        return this._serverInstance();
    }

    init() {
        this.socket.on('connection:status', this.onConnectionStatus.bind(this));
        this.socket.on('subscribe:doc', this.subscribeDOC.bind(this));
        this.socket.on('subscribe:component', this.subscribeComponent.bind(this));
        this.emitConnectionStatus();
    }

    onConnectionStatus() {
        this.emitConnectionStatus();
    }

    emitConnectionStatus() {
        this.socket.emit('connection:status', `${this.socket.connected ? 'Connected' : 'Disconnected'} -> "${this.socket.id}"!`);
    }

    async subscribeDOC(setup) {
        const { collectionName, filter } = Object(setup);

        try {
            const subs = new SocketSubscription({ ...setup }, this.socket);

            this.subscriptions.push(subs);
            const doc = await subs.trigger();

            if (doc) {
                process.on(`socket:update:${collectionName}:${JSON.stringify(filter)}`, () => {
                    subs.trigger().catch(err => {
                        throw new Error.Log(err);
                    });
                });

                this.socket.emit('subscribe:doc:success', doc);
                return subs;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async subscribeComponent(setup) {
        const { path, dataDependencies } = Object(setup);

        try {
            const Component = require('@www/' + path);
            const comp = new Component({ dataDependencies });
            
            await comp.load();

            comp.dataDependencies.map(item => item.addSocketUpdateListener(this));
            this.socket.emit('subscribe:component:success', comp.renderToString().toSuccess());

            return comp;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = SocketConnection;
