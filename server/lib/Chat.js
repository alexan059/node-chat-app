const {generateMessage, generateLocationMessage} = require('../utils/message');
const {isValidString, isRealString} = require('../utils/validation');

const {Rooms} = require('../utils/classes/rooms');

class Chat {

    constructor(io, namespace, users) {
        this.io = io.of(namespace);
        this.users = users;

        this.onCreate();
    }

    onCreate() {
        this.io.on('connection', this.onConnection.bind(this));
    }

    onConnection(socket) {
        this.socket = socket;
        this.events();
    }

    events() {
        this.socket.on('join', this.onJoin.bind(this));
        this.socket.on('createMessage', this.onCreateMessage.bind(this));
        this.socket.on('createLocationMessage', this.onLocationMessage.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
    }

    onJoin(params, callback) {

        console.log(params);

        if (!isValidString(params.name) || !isValidString(params.room)) {
            return callback('Name and room name are required.');
        }

        let room = Rooms.sanitizeName(params.room);

        console.log(`New user "${params.name}" has connected to room "${room}".`);

        this.socket.join(room);
        this.users.removeUser(this.socket.id); // Remove user if already registered in another room
        this.users.addUser(this.socket.id, params.name, room);

        this.io.to(room).emit('updateUserList', this.users.getUserList(room));
        this.socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
        this.socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        callback();
    }

    onCreateMessage(message, callback) {
        let user = this.users.getUser(this.socket.id);

        if (user && isRealString(message.text)) {
            this.io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    }

    onLocationMessage(coords, callback) {
        let user = this.users.getUser(this.socket.id);

        if (user) {
            this.io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

        callback();
    }

    onDisconnect() {
        let user = this.users.removeUser(this.socket.id);

        if (user) {
            console.log(`User "${user.name}" has disconnected from the room "${user.room}"`);

            this.io.to(user.room).emit('updateUserList', this.users.getUserList(user.room));
            this.io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
        }
    }
}

module.exports = {Chat};