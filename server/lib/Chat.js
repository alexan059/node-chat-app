const {generateMessage, generateLocationMessage} = require('../utils/message');
const {isValidString, isRealString} = require('../utils/validation');

const Chatrooms = require('./Chatrooms.js');

class Chat {

    constructor(io) {
        this.io = io;
        this.chat = io.of('/chat');

        this.chatrooms = Chatrooms.getInstance();

        this.onCreate();
    }

    onCreate() {
        this.chat.on('connection', this.onConnection.bind(this));
    }

    onConnection(socket) {
        this.events(socket);
    }

    events(socket) {
        socket.on('join', this.onJoin.bind(this, socket));
        socket.on('createMessage', this.onCreateMessage.bind(this, socket));
        socket.on('createLocationMessage', this.onLocationMessage.bind(this, socket));
        socket.on('disconnect', this.onDisconnect.bind(this, socket));
        socket.on('userIsTyping', this.onTypingUser.bind(this, socket));
    }

    onJoin(socket, params, callback) {

        // if (!isValidString(params.name) || !isValidString(params.room)) {
        //     return callback({error: 'Name and room are not valid.'});
        // }

        // if (this.chatrooms.userNameExists(params.name, params.room)) {
        //     return callback({error: 'User already exists in this room.'});
        // }

        // let user = this.chatrooms.join(socket.id, params.name, {name: params.room, isHidden: params.hidden});

        socket.join(user.room.name);
        this.chat.to(user.room.name).emit('updateUserList', this.chatrooms.getUserList(user.room.name));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
        socket.broadcast.to(user.room.name).emit('newMessage', generateMessage('Admin', `${user.name} has joined.`));

        console.log(`${user.id}: New user "${user.name}" has connected to room "${user.room.name}".`);

        callback({user: user.name});
    }

    onCreateMessage(socket, message, callback) {
        let user = this.chatrooms.getUser(socket.id);

        if (user && isRealString(message.text)) {
            user.isTyping = false;

            this.chat.to(user.room.name).emit('newMessage', generateMessage(user.name, message.text));
            this.chat.to(user.room.name).emit('typingUsers', this.chatrooms.getTypingUsers(user.room.name));

        }

        callback();
    }

    onLocationMessage(socket, coords, callback) {
        let user = this.chatrooms.getUser(socket.id);

        if (user) {
            this.chat.to(user.room.name).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

        callback();
    }

    onTypingUser(socket, isTyping, callback) {
        let user = this.chatrooms.getUser(socket.id);

        if (user) {
            user.isTyping = isTyping;

            this.chat.to(user.room.name).emit('typingUsers', this.chatrooms.getTypingUsers(user.room.name));
        }

        callback();
    }

    onDisconnect(socket) {
        let user = this.chatrooms.leave(socket.id);

        if (user) {

            this.chat.to(user.room.name).emit('typingUsers', this.chatrooms.getTypingUsers(user.room.name));
            this.chat.to(user.room.name).emit('updateUserList', this.chatrooms.getUserList(user.room.name));
            this.chat.to(user.room.name).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

            console.log(`${user.id}: User "${user.name}" has disconnected from the room "${user.room.name}"`);
        }
    }
}

module.exports = {Chat};