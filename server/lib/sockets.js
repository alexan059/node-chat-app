const socketio = require('socket.io');

const {generateMessage, generateLocationMessage} = require('../utils/message');
const {isValidString, isRealString} = require('../utils/validation');
const {makeCaseInsensitive} = require('../utils/string');

const {Users} = require('../utils/users');

let users = new Users();

const sockets = (server) => {
    let io = socketio(server);

    io.on('connection', (socket) => {
        socket.on('join', (params, callback) => {

            if (!isValidString(params.name) || !isValidString(params.room)) {
                return callback('Name and room name are required.');
            }

            let room = makeCaseInsensitive(params.room);

            console.log(`New user "${params.name}" has connected to room "${room}".`);

            socket.join(room);
            users.removeUser(socket.id); // Remove user if already registered in another room
            users.addUser(socket.id, params.name, room);

            io.to(room).emit('updateUserList', users.getUserList(room));
            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
            socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

            callback();
        });

        socket.on('createMessage', (message, callback) => {
            let user = users.getUser(socket.id);

            if (user && isRealString(message.text)) {
                io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            }

            callback();
        });

        socket.on('createLocationMessage', (coords) => {
            let user = users.getUser(socket.id);

            if (user) {
                io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
            }
        });

        socket.on('disconnect', () => {
            let user = users.removeUser(socket.id);

            if (user) {
                console.log(`User "${user.name}" has disconnected from the room "${user.room}"`);

                io.to(user.room).emit('updateUserList', users.getUserList(user.room));
                io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
            }
        });
    });

    return io;
};

module.exports = {sockets, users};