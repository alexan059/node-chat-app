class Chat {

    constructor(io) {
        this.io = io;
        this.chat = io.of('/chat');

        // this.chatrooms = Chatrooms.getInstance();

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
    }

    onJoin(socket, params, callback) { // Todo add execption if room is removed after user added
        //
        // if (!isValidString(params.name) || !isValidString(params.room)) {
        //     return callback('Name and room are not valid.');
        // }
        //
        // let user = this.chatrooms.addUser(socket.id, params.name, params.room);
        //
        // socket.join(user.room.name);
        // this.chat.to(user.room.name).emit('updateUserList', this.chatrooms.getUserList(user.room.name));
        //
        // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
        // socket.broadcast.to(user.room.name).emit('newMessage', generateMessage('Admin', `${user.name} has joined.`));
        //
        // console.log(`${user.id}: New user "${user.name}" has connected to room "${user.room.name}".`);
        //
        // callback();
    }

    onCreateMessage(socket, message, callback) {
        // let user = this.chatrooms.getUser(socket.id);
        //
        // console.log(user);
        //
        // if (user && isRealString(message.text)) {
        //     this.chat.to(user.room.name).emit('newMessage', generateMessage(user.name, message.text));
        // }
        //
        // callback();
    }

    onLocationMessage(socket, coords, callback) {
        // let user = this.chatrooms.getUser(socket.id);
        //
        // if (user) {
        //     this.chat.to(user.room.name).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        // }
        //
        // callback();
    }

    onDisconnect(socket) {
        // let user = this.chatrooms.removeUser(socket.id);
        //
        // if (user) {
        //
        //     console.log(this.chatrooms.getUserList(user.room.name));
        //
        //     this.chat.to(user.room.name).emit('updateUserList', this.chatrooms.getUserList(user.room.name));
        //     this.chat.to(user.room.name).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        //
        //     //this.lobby.updateRoomList(this.rooms.getRooms());
        //
        //     console.log(`${user.id}: User "${user.name}" has disconnected from the room "${user.room.name}"`);
        // }
    }
}

module.exports = {Chat};