const Chatrooms = require('./Chatrooms');

class Lobby {

    constructor(io) {
        this.io = io;
        this.lobby = io.of('/lobby');
        this.chatrooms = Chatrooms.getInstance();

        this.onCreate();
    }

    onCreate() {
        this.lobby.on('connection', this.onConnection.bind(this));
    }

    onConnection(socket) {
        this.updateRoomList(this.chatrooms.getRoomList());
        this.events(socket);
    }

    events(socket) {
        this.chatrooms.on('updateRoomList', this.updateRoomList.bind(this));
    }

    updateRoomList(rooms) {
        this.lobby.emit('updateRoomList', rooms);
    }

}

module.exports = {Lobby};