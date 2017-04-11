const socketio = require('socket.io');
const {Chat} = require('./Chat');


const {generateMessage, generateLocationMessage} = require('../utils/message');
const {isValidString, isRealString} = require('../utils/validation');

const {Rooms} = require('../utils/classes/rooms');


const sockets = (server, users) => {
    let io = socketio(server);

    let chat = new Chat(io, '/chat', users);

    return io;
};

module.exports = {sockets};