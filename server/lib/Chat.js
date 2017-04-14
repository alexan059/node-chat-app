const {isRealString, isValidString, returnCaseInsensitive} = require('../utils/validation');
const {generateMessage, generateLocationMessage} = require('../utils/message');

const {Room} = require('../models/Room');
const {User} = require('../models/User');
const Chatrooms = require('./Chatrooms');

class Chat {

    constructor(io, lobby) {
        this.io = io;
        this.chat = io.of('/chat');
        // this.lobby = lobby;

        this.chatrooms = Chatrooms.getInstance();

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

    onJoin(params, callback) { // Todo add execption if room is removed after user added

        if (!isValidString(params.name) || !isValidString(params.room)) {
            return callback('Name and room are not valid.');
        }

        let user = this.chatrooms.addUser(this.socket.id, params.name, params.room);

        this.socket.join(user.room.name);
        this.chat.to(user.room.name).emit('updateUserList', this.chatrooms.getUserList(user.room.name));

        this.socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
        this.socket.broadcast.to(user.room.name).emit('newMessage', generateMessage('Admin', `${user.name} has joined.`));

        console.log(`${user.id}: New user "${user.name}" has connected to room "${user.room.name}".`);

        callback();
    }

    onCreateMessage(message, callback) {
        let user = this.chatrooms.getUser(this.socket.id);

        console.log(user);

        if (user && isRealString(message.text)) {
            this.chat.to(user.room.name).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    }

    onLocationMessage(coords, callback) {
        let user = this.chatrooms.getUser(this.socket.id);

        if (user) {
            this.chat.to(user.room.name).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

        callback();
    }

    onDisconnect() {
        let user = this.chatrooms.removeUser(this.socket.id);

        if (user) {

            console.log(this.chatrooms.getUserList(user.room.name));

            this.chat.to(user.room.name).emit('updateUserList', this.chatrooms.getUserList(user.room.name));
            this.chat.to(user.room.name).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

            //this.lobby.updateRoomList(this.rooms.getRooms());

            console.log(`${user.id}: User "${user.name}" has disconnected from the room "${user.room.name}"`);
        }
    }
}

module.exports = {Chat};