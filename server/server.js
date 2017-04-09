const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

/*
 *
 * todo Challenges
 * - Case insensitive room names
 * - Unique user name for chat room
 * - Room list at join page (dropdown)
 *
 * todo Goals - 1
 * - Colorpicker for user
 * - Password secured rooms
 * - Hidden rooms
 *
 * todo Goals - 2
 * - Add custom BEM design
 * - Add emojis
 * - Add menu (desktop/mobile)
 *
 * todo Goals - 3
 * - Add whisper (dropdown)
 * - Add authentication (user sign up/login)
 * - Is typing (debounced)
 *
 */

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        console.log(`New user "${params.name}" has connected to room "${params.room}".`);

        socket.join(params.room);
        users.removeUser(socket.id); // Remove user if already registered in another room
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

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

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});