const Rooms = require('./Rooms');

class Lobby {

    constructor(io) {
        this.io = io;
        this.lobby = io.of('/lobby');
        this.rooms = Rooms.getInstance();

        this.onCreate();
    }

    onCreate() {
        this.lobby.on('connection', this.onConnection.bind(this));
    }

    onConnection(socket) {
        this.socket = socket;
        this.updateRoomList(this.rooms.getRooms());
        this.events();
    }

    events() {
    }

    updateRoomList(rooms) {
        this.lobby.emit('updateRoomList', rooms);
    }

}

module.exports = {Lobby};