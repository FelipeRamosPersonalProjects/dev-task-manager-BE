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

    onConnectionStatus(status) {
        console.log(`[connection:status] ${status}`);
    }
}

module.exports = SocketClient;

