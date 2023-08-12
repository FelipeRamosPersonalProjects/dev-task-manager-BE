const { io } = require('socket.io-client');

class SocketClient {
    constructor(setup) {
        try {
            const { host, port } = Object(setup);

            if (!port || !host) {
                throw new Error.Log('common.missing_params', ['port', 'host']);
            }

            this.socket = io(`${host}:${port}`);
            this.port = port;

            this.init();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    init() {
        try {
            this.socket.on('connect', () => {
                console.log('Connected to socket server!');
            });

            this.socket.on('connection:status', this.onConnectionStatus);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    onConnectionStatus(connectionID) {
        console.log(`[connection:status] ${connectionID}`);
        sessionStorage.setItem('socket_id', connectionID);
    }

    subscribeDOC(setup) {
        const { collectionName, filter, onSuccess, onError, onData } = Object(setup);

        try {
            this.socket.emit('subscribe:doc', { collectionName, filter });
            this.socket.on('subscribe:doc:success', onSuccess || new Function());
            this.socket.on('subscribe:doc:error', onError || new Function());
            this.socket.on('subscribe:doc:data', onData || new Function());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    subscribeComponent(setup) {
        const { wrapSelector, $wrap, path, dataDependencies, onSuccess, onError, onData, listeners, data } = Object(setup);
        const $wrapper = $wrap || $(wrapSelector);
        const subsUID = crypto.randomUUID(8).toString('hex');

        try {
            this.socket.emit('subscribe:component', { path, dataDependencies, subsUID, data });
            this.socket.on('subscribe:component:error:' + subsUID, onError || new Function());
            this.socket.on('subscribe:component:success:' + subsUID, (response) => {
                const parsedResponse = JSON.parse(response);

                if (parsedResponse.success) {
                    const $component = $wrapper.html(parsedResponse.data);
                    const cb = onSuccess || new Function();

                    typeof listeners === 'function' && listeners($component);
                    return cb($component, response);
                }
            });

            this.socket.on('subscribe:component:data:' + subsUID, (response) => {
                const parsedResponse = JSON.parse(response);
                debugger
                if (parsedResponse.success) {
                    const $component = $wrapper.html(parsedResponse.data);
                    const cb = onData || new Function();
    
                    return cb($component, response);
                }
            });

        } catch (err) {
            throw new Error.Log(err);
        }
    }

    updateComponent(subsUID, mergeData) {
        try {
            if (!subsUID) {
                throw new Error('The param "subsUID" is required to SocketClient.updateComponent()!');
            }

            if (!mergeData) {
                return;
            }

            this.socket.emit('subscribe:component:clientupdate:' + subsUID, mergeData);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = SocketClient;

