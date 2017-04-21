const {EventEmitter} = require('events');
const _ = require('lodash');
const {prepString} = require('../utils/string');
const bcrypt = require('bcryptjs');

let rooms = null;

class Chatrooms extends EventEmitter {

    constructor() {
        super();
        this.rooms = [];
    }

    register(uniqueId, userName, roomParams) {
        // Find room if exists
        let room = _.find(this.rooms, (room) => room.name === prepString(roomParams.name));

        if (room) {
            this.addUser(uniqueId, userName, room);

            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            // Create room
            room = {
                name: prepString(roomParams.name),
                isHidden: (typeof roomParams.isHidden !== 'undefined' && parseInt(roomParams.isHidden) === 1),
                users: []
            };

            // If no password is assigned create unprotected room
            if (!roomParams.password) {
                this.rooms.push(room);
                this.addUser(uniqueId, userName, room);

                return resolve();
            }

            // Hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(roomParams.password, salt, (err, hash) => {
                    if (err) {
                        return reject(err);
                    }

                    room.password = hash;
                    this.rooms.push(room);
                    this.addUser(uniqueId, userName, room);

                    return resolve();
                });
            });
        });

        // Create room if it doesn't exist
        // if (!room) {
        //     room = {
        //         name: prepString(roomParams.name),
        //         isHidden: (typeof roomParams.isHidden !== 'undefined' && parseInt(roomParams.isHidden) === 1),
        //         users: []
        //     };
        //
        //     // Add room
        //     this.rooms.push(room);
        // }
        //
        // Leave user from old room before assigning to new one
        // this.leave(socketId);
        //
        //
        // Emit the update room list event
        // this.emit('updateRoomList', this.getRoomList());
        //
        // return user;
    }

    join(socketId, userName, roomParams) {
        // Find room if exists
        let room = _.find(this.rooms, (room) => room.name === prepString(roomParams.name));

        // Create room if it doesn't exist
        if (!room) {
            room = {
                name: prepString(roomParams.name),
                isHidden: (typeof roomParams.isHidden !== 'undefined' && parseInt(roomParams.isHidden) === 1),
                users: []
            };

            // Add room
            this.rooms.push(room);
        }

        // Leave user from old room before assigning to new one
        this.leave(socketId);

        let user = {
            id: socketId,
            name: prepString(userName),
            room: room,
            isTyping: false
        };

        // Add user to the room
        room.users.push(user);

        // Emit the update room list event
        this.emit('updateRoomList', this.getRoomList());

        return user;
    }

    leave(socketId) {
        // Get the user
        let user = this.getUser(socketId);

        if (user) {
            // Remove the user from the room
            user.room.users = _.filter(user.room.users, (user) => user.id !== socketId);

            // Remove room if empty
            if (user.room.users.length === 0) {
                this.rooms = _.filter(this.rooms, (room) => room.name !== user.room.name);
            }

            // Emit the update room list event
            this.emit('updateRoomList', this.getRoomList());

            // Get the user back
            return user;
        }
    }

    addUser(uniqueId, userName, room) {
        // Create user
        let user = {
            id: null,
            name: prepString(userName),
            room: room,
            isTyping: false,
            token: uniqueId
        };

        // Add user to the room
        room.users.push(user);
    }

    getUser(socketId) {
        // Find the room containing the user
        let room = _.find(this.rooms, (room) => {
            return (_.findIndex(room.users, (user) => user.id === socketId) !== -1);
        });

        // Return the user if room exists
        if (room) {
            return _.find(room.users, (user) => user.id === socketId);
        }
    }

    getUserList(roomName) {
        // Get the room
        let room = _.find(this.rooms, (room) => room.name === prepString(roomName));

        // Return empty array if room doesn't exist
        if (!room) {
            return [];
        }

        // Return all user names of given room
        return _.map(room.users, (user) => user.name);
    }

    getTypingUsers(roomName) {
        // Get the room
        let room = _.find(this.rooms, (room) => room.name === prepString(roomName));

        // Return empty array if room doesn't exist
        if (!room) {
            return [];
        }

        // Get all typing users
        let users = _.filter(room.users, (user) => user.isTyping);

        // Return all typing user names
        return _.map(users, (user) => user.name);
    }

    userNameExists(userName, roomName) {
        // Find a room if exists
        let room = _.find(this.rooms, (room) => room.name === prepString(roomName));

        // Check if user exists and return true/false
        if (room) {
            return _.findIndex(room.users, (user) => user.name === prepString(userName)) !== -1;
        }

        // Room doesn't exist
        return false;
    }

    getRoomList() {
        // Find all visible rooms
        let rooms = _.filter(this.rooms, (room) => !room.isHidden);

        // Return the room names
        return _.map(rooms, (room) => room.name);
    }

    authenticate(roomName, password) {
        // Find room if exists
        let room = _.find(this.rooms, (room) => room.name === prepString(roomName));

        // Room doesn't exist or isn't password protected
        if (!room || !room.password) {
            return Promise.resolve();
        }

        // Check password
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, room.password, (err, res) => {
                if (res) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

}

// Create a global instance
module.exports.getInstance = () => {
    if (!rooms) {
        rooms = new Chatrooms();
    }

    return rooms;
};

// Reset instance for testing
module.exports.resetInstance = () => {
    rooms = new Chatrooms();
};