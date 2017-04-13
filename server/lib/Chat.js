const {isRealString} = require('../utils/validation');
const {generateMessage, generateLocationMessage} = require('../utils/message');

const {Room} = require('../models/Room');
const Rooms = require('./Rooms');

class Chat {

    constructor(io, lobby) {
        this.io = io;
        this.chat = io.of('/chat');
        this.lobby = lobby;

        this.rooms = Rooms.getInstance();

        this.onCreate();
    }

    onCreate() {
        this.chat.on('connection', this.onConnection.bind(this));
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

        if (!Rooms.allFieldsAreValid(params.name, params.room)) {
            return callback('Name and room name are not valid.');
        }

        let room = this.rooms.registerUser(this.socket.id, params.name, params.room, params.hidden);
        let roomName = room.name;

        this.socket.join(roomName);

        this.chat.to(roomName).emit('updateUserList', this.rooms.getUsers(roomName));

        this.lobby.updateRoomList(this.rooms.getRooms()); // Todo refactor using event listener

        this.socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
        this.socket.broadcast.to(roomName).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        // Log the message
        console.log(`New user "${params.name}" has connected to room "${roomName}".`);

        // Callback on client
        callback();
    }

    onCreateMessage(message, callback) {
        let user = this.rooms.getUser(this.socket.id);

        if (user && isRealString(message.text)) {
            this.chat.to(user.room.name).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    }

    onLocationMessage(coords, callback) {
        let user = this.rooms.getUser(this.socket.id);

        if (user) {
            this.chat.to(user.room.name).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

        callback();
    }

    onDisconnect() {
        let user = this.rooms.unregisterUser(this.socket.id);

        if (user) {

            this.chat.to(user.room.name).emit('updateUserList', this.rooms.getUsers(user.room.name));
            this.chat.to(user.room.name).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

            this.lobby.updateRoomList(this.rooms.getRooms());

            console.log(`User "${user.name}" has disconnected from the room "${user.room.name}"`);
        }
    }
}

module.exports = {Chat};