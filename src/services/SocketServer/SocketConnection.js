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

        this.socket.data.subscribedComponents = {};
        this.emitConnectionStatus();
    }

    onConnectionStatus() {
        this.emitConnectionStatus();
    }

    emitConnectionStatus() {
        this.socket.emit('connection:status', this.socket.id);
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
        const { path, dataDependencies, data, subsUID } = Object(setup);

        try {
            const Component = require('@www/' + path);
            const comp = new Component({ dataDependencies, ...data, subscriptionUID: subsUID });

            if (comp.load) {
                await comp.load();
            }

            comp.dataDependencies.map(item => item.addSocketUpdateListener(this, subsUID));

            this.socket.emit('subscribe:component:success:' + subsUID, comp.renderToString().toSuccess());
            this.socket.on('subscribe:component:clientupdate:' + subsUID, (mergeData) => {
                this.updateComponent(subsUID, mergeData);
            });

            this.appendComponent(subsUID, comp);
            return comp;
        } catch (err) {
            this.socket.emit('subscribe:component:error:' + subsUID, new Error.Log(err).response());
        }
    }

    appendComponent(subscriptionUID, component) {
        try {
            if (!this.socket.data.subscribedComponents) {
                this.socket.data.subscribedComponents = {};
            }

            this.socket.data.subscribedComponents[subscriptionUID] = component;
            return this.socket.data.subscribedComponents[subscriptionUID];
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    updateComponent(subscriptionUID, mergeData) {
        try {
            const component = this.socket.data.subscribedComponents[subscriptionUID];

            component.updateMerge(mergeData);
            this.socket.emit('subscribe:component:data:' + subscriptionUID, component.renderToString().toSuccess());
            return component;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = SocketConnection;
