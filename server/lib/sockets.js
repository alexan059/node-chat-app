const socketio = require('socket.io');
const {Chat} = require('./Chat');
const {Lobby} = require('./Lobby');

const sockets = (server, users) => {
    let io = socketio(server);

    let lobby = new Lobby(io, '/lobby', users);

    let chat = new Chat(io, '/chat', users, lobby);

    return io;
};

module.exports = {sockets};