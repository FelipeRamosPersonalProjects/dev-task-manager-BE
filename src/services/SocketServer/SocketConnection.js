class SocketConnection {
    constructor(socket, serverInstance) {
        try {
            this._serverInstance = () => serverInstance;
            this.socket = socket;

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
        this.emitConnectionStatus('Connected');
    }

    onConnectionStatus() {
        this.emitConnectionStatus('Connected');
    }

    emitConnectionStatus(status) {
        this.socket.emit('connection:status', `${status} -> "${this.socket.id}"!`);
    }
}

module.exports = SocketConnection;
