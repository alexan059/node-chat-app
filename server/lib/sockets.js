const socketio = require('socket.io');
const {Chat} = require('./Chat');
const {Lobby} = require('./Lobby');

const sockets = (server) => {
    let io = socketio(server);

    let lobby = new Lobby(io);

    let chat = new Chat(io);

    return io;
};

module.exports = {sockets};