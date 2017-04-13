class Lobby {

    constructor(io, namespace, users) {
        this.io = io;
        this.lobby = io.of(namespace);
        this.users = users;

        this.onCreate();
    }

    onCreate() {
        this.lobby.on('connection', this.onConnection.bind(this));
    }

    onConnection(socket) {
        this.socket = socket;
        this.updateRoomList(this.users.getRoomList());
        this.events();
    }

    events() {
    }

    updateRoomList(rooms) {
        this.lobby.emit('updateRoomList', rooms);
    }

}

module.exports = {Lobby};